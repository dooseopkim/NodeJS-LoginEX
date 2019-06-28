const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const pool = require("../lib/db");
const queries = require("../lib/queries");

module.exports = passport => {
  router.get("/login", (req, res, next) => {
    /* 이미 로그인 된 경우 */
    let user = req.user;
    if (user) {
      res.send(`<script>alert('이미 로그인 하셨습니다.');history.back();</script>`);
      return false;
    }

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
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    }),
    (req, res, next) => {
      req.session.save(err => {
        if (err) throw err;
        console.log("+++++++++++++++++++++++++++++++");
        console.log(req.session);
        console.log("+++++++++++++++++++++++++++++++");
        res.redirect("/");
      });
    }
    // async (req, res, next) => {
    //   req.session.save(err => {
    //     if (err) throw err;
    //     console.log("씨발아");
    //     res.redirect("/");
    //   });
    // }
  );

  router.get("/logout", (req, res) => {
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", req.session);
    req.logout();
    req.session.save(err => {
      if (err) throw err;
      console.log("개씨발아");
      console.log("^%^%^%^%^%^%^%^%^%^%^%^%^%^%^%^%", req.session);
      res.redirect("/");
      return false;
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

    try {
      let rows = await pool.query(queries.USER_INSERT, args);
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
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    }),
    async (req, res, next) => {
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", req.session);
      req.session.save(err => {
        if (err) throw err;
        console.log("씨발아");
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", req.session);
        res.redirect("/");
      });
    }
  );
  /* Github 로그인 */
  router.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["read:user", "user:email"] })
  );

  router.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    }),
    async (req, res, next) => {
      req.session.save(err => {
        if (err) throw err;
        console.log("씨발아");
        res.redirect("/");
      });
    }
  );

  /* Kakao 로그인 */
  router.get("/auth/kakao", passport.authenticate("kakao"));

  router.get(
    "/auth/kakao/callback",
    passport.authenticate("kakao", {
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    }),
    async (req, res, next) => {
      req.session.save(err => {
        if (err) throw err;
        console.log("씨발아");
        res.redirect("/");
      });
    }
  );

  /* Naver 로그인 */
  router.get("/auth/naver", passport.authenticate("naver"));

  router.get(
    "/auth/naver/callback",
    passport.authenticate("naver", {
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    }),
    async (req, res, next) => {
      req.session.save(err => {
        if (err) throw err;
        console.log("씨발아");
        res.redirect("/");
      });
    }
  );

  /* FaceBook 로그인 */
  router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successFlash: true,
      failureRedirect: "/user/login",
      failureFlash: true
    }),
    async (req, res, next) => {
      req.session.save(err => {
        if (err) throw err;
        console.log("씨발아");
        res.redirect("/");
      });
    }
  );
  return router;
};
