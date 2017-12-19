import { dirname, resolve, sep } from 'path';
import * as _ from 'lodash';
import glob from 'glob';
import micromatch from 'micromatch';
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
    this._extendTest = new RegExp(`^${this._options.extendKey}(:([\\S]+))?$`);
  }

  _getDependencies(data, context, at = []) {
    const dependencies = [];
    Object.keys(data).forEach(key => {
      const value = data[key];
      const type = typeof value;
      if (type === 'object' && value !== null) {
        Array.prototype.push.apply(
          dependencies,
          this._getDependencies(value, context, [].concat(at, [key]))
        );
      } else if (type === 'string') {
        const matches = this._extendTest.exec(key);
        if (matches !== null) {
          _.unset(data, key);

          const resolvedFilePath = resolveFile(value, context);
          const targetPath = matches[2] ? matches[2].split('.') : [];
          const files = glob.sync(resolvedFilePath);
          files.forEach(itemFile => {
            const resolvedItemFilePath = resolve(itemFile);
            const capturePath = micromatch.capture(
              resolvedFilePath.split(sep).join('/'),
              resolvedItemFilePath.split(sep).join('/')
            );
            dependencies.push({
              filePath: resolvedItemFilePath,
              at: [].concat(at, targetPath, capturePath),
            });
          });
        }
      }
    });
    return dependencies;
  }

  _extend(data, filePath, pool, ancestors) {
    return new Promise((resolve, reject) => {
      const context = dirname(filePath);
      const dependencies = this._getDependencies(data, context);
      if (dependencies.length < 1) {
        setImmediate(() => {
          resolve(data);
        });
      } else {
        let loadedDependencies = 0;
        function loadNextDependency() {
          if (loadedDependencies === dependencies.length) {
            dependencies.forEach(dependency => {
              const atRoot = dependency.at.length < 1;
              const source = atRoot ? data : _.get(data, dependency.at);
              const merged = _.mergeWith(
                {},
                pool[dependency.filePath],
                source,
                this._options.mergeCustomizer
              );

              if (atRoot) {
                data = merged;
              } else {
                _.set(data, dependency.at, merged);
              }
            });
            resolve(data);
          } else {
            this._read(
              dependencies[loadedDependencies].filePath,
              pool,
              ancestors
            )
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

  _read(filePath, pool = {}, ancestors = []) {
    return new Promise((resolve, reject) => {
      const updatedAncestors = [].concat(ancestors, [filePath]);

      if (ancestors.indexOf(filePath) >= 0) {
        setImmediate(() => {
          reject(new Error(`Recursion Error: ${updatedAncestors.join(' > ')}`));
        });
      } else if (pool[filePath]) {
        setImmediate(() => {
          resolve(pool[filePath]);
        });
      } else {
        readJSON(filePath)
          .then(data => this._extend(data, filePath, pool, updatedAncestors))
          .then(extendedData => {
            pool[filePath] = extendedData;
            resolve(extendedData);
          })
          .catch(error => reject(error));
      }
    });
  }

  load() {
    const pool = {};
    return this._read(resolveFile(this._options.entry), pool).then(data => ({
      data,
      files: Object.keys(pool),
    }));
  }
}

export default Loader;
