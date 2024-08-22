var express = require("express");
var router = express.Router();
const driveController = require("../controllers/driveController.js");
const upload = require("../config/upload.js");
const cloudinary = require("../config/cloudinary.js");

// Drive Routes

router.get("/", driveController.index);

router.post("/create-folder", driveController.folderCreatePost);

router.post("/upload", upload.single("file"), driveController.uploadFile);

router.post("/delete/folder", driveController.folderDeletePost);

router.post("/delete/file", driveController.fileDeletePost);

router.post("/update/folder", driveController.folderUpdatePost);

router.post("/update/file", driveController.fileUpdatePost);

module.exports = router;
