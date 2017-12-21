import { dirname, join } from 'path';
import * as _ from 'lodash';
import readJSON from './readJSON';
import resolveFile from './resolveFile';
import getDependencies from './getDependencies';

const DEFAULT_OPTIONS = {
  entry: null,
  extendKey: '_extends',
  mergeCustomizer: null,
  context: process.cwd(),
};

class Loader {
  constructor(options) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);
    this._extendTest = new RegExp(`^${this._options.extendKey}(:([\\S]+))?$`);
  }

  _extend(data, filePath, pool = {}, ancestors = []) {
    return new Promise((resolve, reject) => {
      const dependencies = getDependencies(
        data,
        this._options.extendKey,
        dirname(filePath)
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
              _.unset(data, dependency.sourceAt);

              const atRoot = dependency.targetAt.length < 1;
              const source = atRoot ? data : _.get(data, dependency.targetAt);
              const merged = _.mergeWith(
                {},
                pool[dependency.filePath],
                source,
                this._options.mergeCustomizer
              );

              if (atRoot) {
                data = merged;
              } else {
                _.set(data, dependency.targetAt, merged);
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
    const isObject = typeof this._options.entry === 'object';
    const p = isObject
      ? this._extend(
          Object.assign({}, this._options.entry),
          join(this._options.context, '__DATA_ENTRY__'),
          pool
        )
      : this._read(
          resolveFile(this._options.entry, this._options.context),
          pool
        );

    return p.then(data => ({
      data,
      files: Object.keys(pool),
    }));
  }
}

export default Loader;
