const multer = require('multer');

const upload = multer({
  limits: {
    // TODO: I'll eventually want to lower the filesize
    fileSize: 4 * 1024 * 1024000,
  }
});

module.exports = upload