import { diskStorage } from 'multer';

export const multerConfigSponsor = {
  storage: diskStorage({
    destination: './public/sponsors',
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().toISOString().replace(/:/g, '-') +
          file.originalname +
          '.' +
          file.mimetype.split('/')[1],
      );
    },
  }),
};
