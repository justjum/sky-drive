const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

exports.indexGet = async function (req, res, next) {
  res.render("index", {
    title: "Sky Drive",
    user: req.user,
  });
};

exports.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login-error",
});

exports.logInErrorGet = async function (req, res, next) {
  res.render("login-error", {
    title: "Login Error",
  });
};

exports.logOut = function (req, res, next) {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.redirect(".");
  });
};

exports.signUpGet = async function (req, res, next) {
  res.render("sign-up-form", {
    title: "Sky Drive",
    subtitle: "Login Form",
  });
};

exports.signUpPost = [
  body("username", "Username must be at least 5 characters")
    .isLength({
      min: 5,
    })
    .custom(async (value, { req }) => {
      const user = await prisma.user.findFirst({
        where: { username: req.body.username },
      });
      console.log(user);
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  body("password", "Password must be eight characters long")
    .isLength({
      min: 8,
    })
    .escape(),
  body("confirm-password", "Passwords do not match").custom(
    async (value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Passwords must be identical");
      }
    }
  ),

  async function (req, res, next) {
    const errors = validationResult(req);
    const newUser = {
      username: req.body.username,
      f_name: req.body.f_name,
      l_name: req.body.l_name,
    };

    if (!errors.isEmpty()) {
      console.log("error");
      res.render("sign-up-form", {
        title: "Sky Drive",
        subtitle: "Login",
        errors: errors.array(),
        newUser: newUser,
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        try {
          await prisma.user.create({
            data: {
              username: req.body.username,
              f_name: req.body.f_name,
              l_name: req.body.l_name,
              password: hashedPassword,
            },
          });
          res.redirect("/");
        } catch (err) {
          return next(err);
        }
      });
    }
  },
];

exports.uploadFile = async function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  console.log(req.file.filename);
  res.redirect("/");
};

exports.driveGet = async function (req, res, next) {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  for (let x = 0; x < folders.length; x++) {
    if (folders[x].parentId == req.query.id) {
      folders[x].isVisible = true;
    } else {
      folders[x].isVisible = false;
    }
  }
  console.log(req.query.id);
  let currentFolder = "";
  if (req.query.id != "") {
    console.log(req.query.id);
    const id = parseInt(req.query.id);
    currentFolder = await prisma.folder.findFirst({
      where: { id: id },
    });
  }

  res.render("drive", {
    title: "Sky Drive",
    subtitle: "Your Sky",
    user: req.user,
    folders: folders,
    currentFolder: currentFolder,
  });
};
