var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var shortid = require("shortid");
var db = require("../lib/db");
var queries = require("../lib/queries");

module.exports = function(passport) {
  router.get("/login", function(req, res, next) {
    var fmsg = req.flash();
    var resParams = {};
    if (fmsg.message) {
      resParams.msg = fmsg.message;
    }
    resParams.content = "login";
    res.render("common", resParams);
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
    var fmsg = req.flash();
    var resParams = {};
    if (fmsg.message) {
      resParams.msg = fmsg.message;
    }
    resParams.content = "signin";
    res.render("common", resParams);
  });
  router.post("/signin", function(req, res, next) {
    /* 
      19.05.09 bcrypt 추가 
      req.body.userPassword -> bcrypt함수적용
    */
    var insertParams = [
      shortid.generate(),
      req.body.userName,
      req.body.userEmail,
      bcrypt.hashSync(req.body.userPassword, 10)
    ];
    db.query(queries.USER_INSERT, insertParams, function(err, result) {
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
  /* Github 로그인 */
  router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

  router.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      successRedirect: "/",
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    })
  );
  return router;
};
