var express = require("express");
var router = express.Router();
const passport = require("passport");
const controller = require("../controllers/controller");
const upload = require("../controllers/upload.js");

/* GET home page. */
router.get("/", controller.indexGet);

router.post("/log-in", controller.logInPost);

router.get("/log-out", controller.logOut);

router.get("/sign-up", controller.signUpGet);

router.post("/sign-up", controller.signUpPost);

router.get("/login-error", controller.logInErrorGet);

router.post("/upload", upload.single("file"), controller.uploadFile);

router.get("/drive", controller.driveGet);

module.exports = router;
