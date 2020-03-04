module.exports = function(app) {
  const pool = require("./db");
  const queries = require("./queries");
  const bcrypt = require("bcrypt");
  const shortid = require("shortid");
  const commonJS = require("./common");

  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
  const GitHubStrategy = require("passport-github2").Strategy;
  const KakaoStrategy = require("passport-kakao").Strategy;
  const NaverStrategy = require("passport-naver").Strategy;
  const FacebookStrategy = require("passport-facebook").Strategy;

  const CREDENTIALS = commonJS.requireErrorCatch("../config/_key.json", "../config/keyTemplate");
  const GOOGLE_CREDENTIALS = CREDENTIALS.google;
  const GITHUB_CREDENTIALS = CREDENTIALS.github;
  const KAKAO_CREDENTIALS = CREDENTIALS.kakao;
  const NAVER_CREDENTIALS = CREDENTIALS.naver;
  const FACEBOOK_CREDENTIALS = CREDENTIALS.facebook;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    console.log("serializeUser ", user);
    done(null, user.id);
  });
  // passport.deserializeUser(async (id, done) => {
  //   try {
  //     let rows = await pool.query(queries.USER_SELECT_ONE_WHERE_ID, [id]);
  //     let user = rows[0];
  //     if (!user) {
  //       return done(new Error("user not found"));
  //     }
  //     done(null, user);
  //   } catch (e) {
  //     done(e);
  //   }
  // });
  passport.deserializeUser((id, done) => {
    console.log("deserializeUser ", id);

    // try {
    let rows = pool.query(queries.USER_SELECT_ONE_WHERE_ID, [id]);
    let user;
    rows
      .then(arr => {
        user = arr[0];

        console.log(user);
        if (!user) {
          return done(new Error("user not found"));
        }
        done(null, user);
      })
      .catch(err => {
        if (err) throw err;
      });
    // } catch (e) {
    //   done(e);
    // }
  });
  //   passport.use(new LocalStrategy({
  //     usernameField: 'email',
  //     passwordField: 'passwd',
  //     passReqToCallback: true,
  //     session: false
  //   },
  //   function(req, username, password, done) {
  //     // request object is now first argument
  //     // ...
  //   }
  // ));
  passport.use(
    new LocalStrategy(
      {
        usernameField: "userEmailUserName",
        passwordField: "userPassword"
      },
      // async (req, username, password, done) => {
      (username, password, done) => {
        console.log("==========================================");
        // console.log(req.session);

        let user;
        // try {
        // let rows = await pool.query(queries.USER_SELECT_ONE_WHERE_USERNAME_OR_EMAIL, [
        //   username,
        //   username
        // ]);
        // user = rows[0];
        let rows = pool.query(queries.USER_SELECT_ONE_WHERE_USERNAME_OR_EMAIL, [
          username,
          username
        ]);
        rows
          .then(arr => {


            user = arr[0];

            if (!user) {
              return done(null, false, { message: "Incorrect username or email" });
            }
       
            let isCompared = bcrypt.compareSync(password, user.password);
            if (!isCompared) {
              return done(null, false, { message: "Incorrect password." });
            }
            // req.session.save();
 
            return done(null, user, { message: "Login Success" });
          })
          .catch(err => {
            if (err) console.error(err);
          });
      }
    )
  );

  const _socialLogin = async (sns_id, sns_type, sns_name, sns_email, done) => {
    let args, rows, user;
    let user_id, user_password;

    /* Email O | Account O | SocialLogin O */
    try {
      rows = await pool.query(queries.USER_JOIN_SNS_INFO_SELECT_ONE_WHERE_SNSID, [sns_id]);
      user = rows[0];
      console.log(user);
    } catch (e) {
      return done(e);
    }

    if (user) {
      return done(null, user, { messgae: "Login success with social auth" }); // login
    }

    /* Email X | Account X | SocialLogin X */
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
      /* Email O | Account O | SocialLogin X */
      user_id = user.id;
    } else {
      /* Email O | Account X | SocialLogin X */
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

  passport.use(
    new NaverStrategy(
      {
        clientID: NAVER_CREDENTIALS.client_id,
        clientSecret: NAVER_CREDENTIALS.client_secret,
        callbackURL: NAVER_CREDENTIALS.callback_urls[0]
      },
      async (accessToken, refreshToken, profile, done) => {
        let _json = profile._json;
        let sns_id = _json.id;
        let sns_email = _json.email;
        let sns_type = "SM04"; // naver_oauth's id from sns_meta table
        let sns_name = _json.nickname;

        _socialLogin(sns_id, sns_type, sns_name, sns_email, done);
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_CREDENTIALS.client_id,
        clientSecret: FACEBOOK_CREDENTIALS.client_secret,
        callbackURL: FACEBOOK_CREDENTIALS.callback_URL,
        profileFields: FACEBOOK_CREDENTIALS.profileFields
      },
      async (accessToken, refreshToken, profile, done) => {
        let _json = profile._json;
        let sns_id = _json.id;
        let sns_email = _json.email;
        let sns_type = "SM05"; // facebook_oauth's id from sns_meta table
        let sns_name = _json.name;

        _socialLogin(sns_id, sns_type, sns_name, sns_email, done);
      }
    )
  );
  return passport;
};
