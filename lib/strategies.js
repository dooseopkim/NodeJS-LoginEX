module.exports = function(app) {
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
  const GitHubStrategy = require("passport-github2").Strategy;
  const KakaoStrategy = require("passport-kakao").Strategy;

  const GOOGLE_CREDENTIALS = require("../config/_google.json");
  const GITHUB_CREDENTIALS = require("../config/_github.json");
  const KAKAO_CREDENTIALS = require("../config/_kakao.json");

  const pool = require("./db");
  const queries = require("./queries");
  const bcrypt = require("bcrypt");
  const shortid = require("shortid");

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      let rows = await pool.query(queries.USER_SELECT_ONE_WHERE_ID, [id]);
      let user = rows[0];
      if (!user) {
        return done(new Error("user not found"));
      }
      done(null, user);
    } catch (e) {
      done(e);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "userEmailUserName",
        passwordField: "userPassword"
      },
      async (username, password, done) => {
        let user;
        try {
          let rows = await pool.query(queries.USER_SELECT_ONE_WHERE_USERNAME_OR_EMAIL, [
            username,
            username
          ]);
          user = rows[0];
          if (!user) {
            return done(null, false, { message: "Incorrect username or email" });
          }
        } catch (e) {
          return done(e);
        }
        let isCompared = bcrypt.compareSync(password, user.password);
        if (!isCompared) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user, { message: "Login Success" });
      }
    )
  );

  const _socialLogin = async (sns_id, sns_type, sns_name, sns_email, done) => {
    let args, rows, user;
    let user_id, user_password;
    let flag = false;

    /* Email O | Account O | GoogleLogin O */
    try {
      rows = await pool.query(queries.USER_JOIN_SNS_INFO_SELECT_ONE_WHERE_SNSID, [sns_id]);
      user = rows[0];
    } catch (e) {
      return done(e);
    }

    if (user) {
      return done(null, user, { messgae: "Login success with social auth" }); // login
    }

    /* Email X | Account X | GoogleLogin X */
    if (!sns_email) {
      sns_email = bcrypt.hashSync(`${sns_id}^^${sns_type}`, 10); // dummy..?
    }

    try {
      rows = await pool.query(queries.USER_SELECT_ONE_WHERE_EMAIL, [sns_email]);
      user = rows[0];
    } catch (e) {
      return done(e);
    }

    if (user) {
      /* Email O | Account O | GoogleLogin X */
      user_id = user.id;
    } else {
      /* Email O | Account X | GoogleLogin X */
      user_id = shortid.generate();
      user_password = bcrypt.hashSync(`${sns_type}@@${sns_id}`, 10);
      args = [user_id, sns_name, sns_email, user_password];
      try {
        // Register new account
        rows = await pool.query(queries.USER_INSERT, args);
      } catch (e) {
        return done(e);
      }
    }
    try {
      // Update users's sns_link status from 0 to ???
      rows = await pool.query(queries.USER_UPDATE_SNS_LINK_ACTIVATION_WHERE_ID, [user_id]);
      // Register user's social info
      args = [user_id, sns_id, sns_type, sns_name];
      rows = await pool.query(queries.SNS_INFO_INSERT, args);
      // Almost done, log in! and return 'done!'
      rows = await pool.query(queries.USER_SELECT_ONE_WHERE_ID, [user_id]);
      user = rows[0];
      return done(null, user, { message: "Login success with social auth" });
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CREDENTIALS.web.client_id,
        clientSecret: GOOGLE_CREDENTIALS.web.client_secret,
        callbackURL: GOOGLE_CREDENTIALS.web.redirect_uris[0]
      },
      async (accessToken, refreshToken, profile, done) => {
        let _json = profile._json;
        let sns_id = _json.sub;
        let sns_email = _json.email;
        let sns_type = "SM01"; // google_oauth's id from sns_meta table
        let sns_name = _json.given_name;

        _socialLogin(sns_id, sns_type, sns_name, sns_email, done);
      }
    )
  );
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CREDENTIALS.client_id,
        clientSecret: GITHUB_CREDENTIALS.client_secret,
        callbackURL: GITHUB_CREDENTIALS.callback_urls[0]
      },
      async (accessToken, refreshToken, profile, done) => {
        let _json = profile._json;
        let sns_id = _json.id;
        let sns_email = _json.email;
        let sns_type = "SM02"; // github_oauth's id from sns_meta table
        let sns_name = _json.login;

        _socialLogin(sns_id, sns_type, sns_name, sns_email, done);
      }
    )
  );

  passport.use(
    new KakaoStrategy(
      {
        clientID: KAKAO_CREDENTIALS.client_id,
        clientSecret: KAKAO_CREDENTIALS.client_secret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
        callbackURL: KAKAO_CREDENTIALS.callback_urls[0]
      },
      async (accessToken, refreshToken, profile, done) => {
        let _json = profile._json;
        let sns_id = _json.id;
        let sns_email = _json.kaccount_email;
        let sns_type = "SM03"; // kakao_oauth's id from sns_meta table
        let sns_name = _json.properties.nickname;

        _socialLogin(sns_id, sns_type, sns_name, sns_email, done);
      }
    )
  );
  return passport;
};
