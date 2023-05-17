/* eslint-disable no-console */
const fs = require('fs');
/**
 *
 * @param {string} miniaturePath File path if exists.
 */

const deleteLocalFileIfExists = (miniaturePath) =>
  new Promise((resolve, reject) => {
    const filePath = `./uploads/${miniaturePath}`;
    fs.promises
      .access(filePath)
      .then(() => {
        fs.unlink(filePath, (error) => {
          if (error) {
            reject(error);
          } else {
            console.info('El archivo se ha reemplazado correctamente');
            resolve();
          }
        });
      })
      .catch(() => {
        reject(new Error(`El archivo ${filePath} no existe`));
      });
  });

module.exports = {
  deleteLocalFileIfExists
};
