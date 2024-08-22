const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.memoryStorage();

// Create the multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
});

module.exports = upload;

// diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
