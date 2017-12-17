import { readFile } from 'fs';

function readJSON(filePath) {
  return new Promise((resolve, reject) => {
    readFile(filePath, { encoding: 'utf8' }, (error, content) => {
      if (error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(content));
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

export default readJSON;
