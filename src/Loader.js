import { dirname } from 'path';
import * as _ from 'lodash';
import readJSON from './readJSON';
import resolveFile from './resolveFile';

const DEFAULT_OPTIONS = {
  entry: null,
  extendKey: '_extends',
  mergeCustomizer: null,
};

class Loader {
  constructor(options) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  _getDependencies(data, at = []) {
    const dependencies = [];
    Object.keys(data).forEach(key => {
      const value = data[key];
      const type = typeof value;
      if (key === this._options.extendKey && type === 'string') {
        dependencies.push({
          filePath: value,
          at,
        });
      } else if (type === 'object' && value !== null) {
        Array.prototype.push.apply(
          dependencies,
          this._getDependencies(value, [].concat(at, [key]))
        );
      }
    });
    return dependencies;
  }

  _extend(data, filePath, ancestors = []) {
    return new Promise((resolve, reject) => {
      const context = dirname(filePath);
      const dependencies = this._getDependencies(data).map(dependency =>
        Object.assign({}, dependency, {
          filePath: resolveFile(dependency.filePath, context),
        })
      );

      if (dependencies.length < 1) {
        setImmediate(() => {
          resolve(data);
        });
      } else {
        let loadedDependencies = 0;
        function loadNextDependency() {
          if (loadedDependencies === dependencies.length) {
            dependencies.forEach(dependency => {
              const source = _.get(data, dependency.at);
              const merged = _.mergeWith(
                {},
                this._cache[dependency.filePath],
                source,
                this._options.mergeCustomizer
              );
              _.unset(merged, this._options.extendKey);
              _.set(data, dependency.at, merged);
            });
            resolve(data);
          } else {
            this._read(dependencies[loadedDependencies].filePath, ancestors)
              .then(data => {
                loadedDependencies++;
                loadNextDependency();
              })
              .catch(error => reject(error));
          }
        }
        loadNextDependency = loadNextDependency.bind(this);
        loadNextDependency();
      }
    });
  }

  _read(filePath, ancestors = []) {
    return new Promise((resolve, reject) => {
      const updatedAncestors = [].concat(ancestors, [filePath]);

      if (ancestors.indexOf(filePath) >= 0) {
        setImmediate(() => {
          reject(new Error(`Recursion Error: ${updatedAncestors.join(' > ')}`));
        });
      } else if (this._cache[filePath]) {
        setImmediate(() => {
          resolve(this._cache[filePath]);
        });
      } else {
        readJSON(filePath)
          .then(data => this._extend(data, filePath, updatedAncestors))
          .then(extendedData => {
            this._cache[filePath] = extendedData;
            resolve(extendedData);
          })
          .catch(error => reject(error));
      }
    });
  }

  load() {
    this._cache = {};
    return this._read(resolveFile(this._options.entry));
  }
}

export default Loader;
