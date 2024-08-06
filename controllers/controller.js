const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

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

exports.signUpGet = async function (req, res, next) {
  res.render("sign-up-form", {
    title: "Sign Up",
  });
};

exports.signUpPost = async function (req, res, next) {};
