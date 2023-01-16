import * as fs from 'fs';
import * as path from 'path';

export const clearImage = (filePath) => {
  const pathSplit = filePath.split('\\');
  filePath = path.join(__dirname, '..', '..', ...pathSplit);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log('UNABLE TO DELETE THE IMAGE FROM THE STORAGE', err);
    }
  });
};
