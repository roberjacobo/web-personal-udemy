const fs = require("fs");
/**
 *
 * @param {string} miniaturePath File path if exists.
 */
const deleteLocalFileIfExists = (miniaturePath) => {
  return new Promise((resolve, reject) => {
    const filePath = `./uploads/${miniaturePath}`;
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (error) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log("El archivo se ha reemplazado correctamente");
          resolve();
        }
      });
    } else {
      console.log(`El archivo ${filePath} no existe`);
      resolve();
    }
  });
};

module.exports = {
  deleteLocalFileIfExists,
};
