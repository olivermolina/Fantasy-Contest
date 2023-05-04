import fs from 'fs';

/**
 * Read a JSON file and return the parsed data
 *
 * @param filePath  json file path
 */
export const getJSONDataFromFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) reject(err);
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (e) {
        reject(e);
      }
    });
  });
};
