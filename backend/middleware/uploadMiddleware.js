const multer = require("multer");
const path = require("path");


// ==========================================
// STORAGE CONFIGURATION
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});


// ==========================================
// FILE FILTER
// ==========================================
const fileFilter = (req, file, cb) => {
  const allowedFileTypes =
    /jpeg|jpg|png|webp/;

  const extname =
    allowedFileTypes.test(
      path.extname(file.originalname)
        .toLowerCase()
    );

  const mimetype =
    allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed"
      )
    );
  }
};


// ==========================================
// MULTER UPLOAD CONFIG
// ==========================================
const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;