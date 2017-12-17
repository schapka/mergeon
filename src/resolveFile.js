import { isAbsolute, normalize, resolve } from 'path';

function resolveFile(filePath, context = process.cwd()) {
  const normalizedFilePath = normalize(filePath);
  if (isAbsolute(normalizedFilePath)) {
    return normalizedFilePath;
  } else {
    return resolve(context, normalizedFilePath);
  }
}

export default resolveFile;
