const multer = require('multer');
const path = 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  // A much simpler and more reliable file filter
  fileFilter: (req, file, cb) => {
    // Check if the file's original name matches the allowed extensions
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      // If it doesn't match, reject the file
      return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    // If it matches, accept the file
    cb(null, true);
  }
});

module.exports = upload;