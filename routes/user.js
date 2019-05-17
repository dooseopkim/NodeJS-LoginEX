const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const pool = require("../lib/db");
const queries = require("../lib/queries");

module.exports = passport => {
  router.get("/login", (req, res, next) => {
    const fmsg = req.flash();
    let resParams = {};
    if (fmsg.error) {
      resParams.msg = fmsg.error;
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
  router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy(err => {
      if (err) throw err;
      res.redirect("/");
    });
  });
  router.get("/signin", (req, res, next) => {
    const fmsg = req.flash();
    let resParams = {};
    if (fmsg.message) {
      resParams.msg = fmsg.message;
    }
    resParams.content = "signin";
    res.render("common", resParams);
  });
  router.post("/signin", async (req, res, next) => {
    if (!req.body.userName || !req.body.userEmail || !req.body.userPassword) {
      res.send(
        `<script> alert('올바르지 않은 입력값 입니다.'); location.href='/user/signin'</script>`
      );
      return false;
    }
    let args = [
      shortid.generate(),
      req.body.userName,
      req.body.userEmail,
      bcrypt.hashSync(req.body.userPassword, 10)
    ];
    console.log("args1", args);
    try {
      let rows = await pool.query(queries.USER_INSERT, args);
      console.log("rows", rows);
      res.redirect("/user/login");
    } catch (e) {
      throw e;
    }
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
  router.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["read:user", "user:email"] })
  );

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
