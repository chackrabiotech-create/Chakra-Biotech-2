const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } = require('../config/constants');

const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    }
  });
};

const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
  }
};

const createUploadMiddleware = (folder, fieldName = 'image', multiple = false) => {
  const storage = createCloudinaryStorage(folder);
  const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
  });

  return multiple ? upload.array(fieldName, 10) : upload.single(fieldName);
};

module.exports = { createUploadMiddleware };
