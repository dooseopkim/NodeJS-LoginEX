var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var shortid = require("shortid");
var db = require("../lib/db");
var queries = require("../lib/queries");

module.exports = function(passport) {
  router.get("/login", function(req, res, next) {
    res.render("common", { content: "login" });
  });
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    })
  );
  router.get("/logout", function(req, res) {
    req.logout();
    req.session.destroy(function(err) {
      if (err) throw err;
      res.redirect("/");
    });
  });
  router.get("/signin", function(req, res, next) {
    res.render("common", { content: "signin" });
  });
  router.post("/signin", function(req, res, next) {
    /* 
      19.05.09 bcrypt 추가 
      req.body.userPassword -> bcrypt함수적용

    */
    var inputParams = [
      shortid.generate(),
      req.body.userId,
      bcrypt.hashSync(req.body.userPassword, 10),
      req.body.userNickName
    ];
    db.query(queries.USER_INSERT, inputParams, function(err, result) {
      if (err) throw err;
      res.redirect("/user/login");
    });
  });
  /** Google 로그인 */
  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["https://www.googleapis.com/auth/plus.login", "email"]
    })
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    })
  );
  return router;
};
