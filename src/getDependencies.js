import { resolve, sep } from 'path';
import glob from 'glob';
import micromatch from 'micromatch';
import resolveFile from './resolveFile';

function getDependencies(
  data,
  extendKey = '_extends',
  context = process.cwd(),
  at = []
) {
  const dependencies = [];
  Object.keys(data).forEach(key => {
    const value = data[key];
    const type = typeof value;
    if (type === 'object' && value !== null) {
      Array.prototype.push.apply(
        dependencies,
        getDependencies(value, extendKey, context, [].concat(at, [key]))
      );
    } else if (type === 'string' && key.indexOf(extendKey) === 0) {
      const splittedKey = key.split(':');
      const targetPath =
        splittedKey.length > 1 ? splittedKey[1].split('.') : [];
      const sourceAt = [].concat(at, [key]);
      const filePattern = resolveFile(value, context);
      const files = glob.sync(filePattern);
      files.forEach(file => {
        const filePath = resolve(file);
        const capturePath = micromatch
          .capture(
            filePattern.split(sep).join('/'),
            filePath.split(sep).join('/')
          )
          .reduce((acc, segment) => [].concat(acc, segment.split('/')), []);
        const targetAt = [].concat(at, targetPath, capturePath);
        dependencies.push({
          filePath,
          sourceAt,
          targetAt,
        });
      });
    }
  });
  return dependencies.sort((a, b) => b.sourceAt.length - a.sourceAt.length);
}

export default getDependencies;
