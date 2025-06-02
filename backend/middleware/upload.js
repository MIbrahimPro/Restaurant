// /middleware/upload.js

const multer = require("multer");
const path = require("path");

// Destination folder: ./uploads/
// (You can change that to any folder you want)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // e.g. item-<timestamp>.<ext>
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

// Accept only images
function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|gif|svg/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOK = allowed.test(file.mimetype);
  const extOK = allowed.test(ext);
  if (mimeOK && extOK) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, gif, svg)"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
