const multer  = require('multer');
const path = require('path');
const uuid = require('uuid')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/');
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4()+'.jpg'); // генерация уникального имени файла
  }
});

module.exports = multer({ storage: storage });