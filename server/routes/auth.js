const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login } = require('../controllers/auth');

const bodyParser=require("body-parser");
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);

module.exports = router;
