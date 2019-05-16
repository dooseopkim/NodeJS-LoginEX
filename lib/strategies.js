module.exports = function(app) {
  var passport = require("passport");
  var LocalStrategy = require("passport-local").Strategy;
  var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
  var GitHubStrategy = require("passport-github2").Strategy;

  var GOOGLE_CREDENTIALS = require("../config/_google.json");
  var GITHUB_CREDENTIALS = require("../config/_github.json");

  var db = require("./db");
  var queries = require("./queries");
  var bcrypt = require("bcrypt");
  var shortid = require("shortid");

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    db.query(queries.USER_SELECT_ONE_FOR_ID, [id], function(err, result) {
      if (err) throw err;
      done(err, result[0]);
    });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "userEmailUserName",
        passwordField: "userPassword"
      },
      function(username, password, done) {
        db.query(queries.USER_SELECT_ONE_WHERE_USERNAME_OR_EMAIL, [username, username], function(
          err,
          result
        ) {
          if (err) throw err;
          var user = result[0];
          if (user) {
            if (bcrypt.compareSync(password, user.password)) {
              return done(null, user, { message: "Login Success" });
            } else {
              return done(null, false, { message: "Incorrect password." });
            }
          } else {
            return done(null, false, { message: "Incorrect username or email" });
          }
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CREDENTIALS.web.client_id,
        clientSecret: GOOGLE_CREDENTIALS.web.client_secret,
        callbackURL: GOOGLE_CREDENTIALS.web.redirect_uris[0]
      },
      function(accessToken, refreshToken, profile, done) {
        var _json = profile._json;
        var sns_email = _json.email;
        var sns_id = _json.sub;
        var sns_type = "SM01"; // google_oauth's id from sns_meta table
        var sns_name = _json.given_name;

        /* 기존에 구글로 로그인 한 경우 -> 로그인 처리 */
        db.query(queries.USER_JOIN_SNS_INFO_SELECT_ONE_WHERE_SNSID, [sns_id], function(
          err,
          results
        ) {
          if (err) throw err;
          var user = results[0];
          if (user) {
            return done(err, user, { message: "Login Success with google" });
          } else {
            /* 기존에 가입한 계정(이메일)이 있는 경우 -> 구글 연동 */
            if (sns_email) {
              db.query(queries.USER_SELECT_ONE_WHERE_EMAIL, [sns_email], function(err1, results1) {
                if (err1) throw err1;
                var user = results1[0];
                if (user) {
                  db.query(queries.USER_UPDATE_SNS_LINK_ACTIVATION_WHERE_ID, [user.id], function(
                    err2,
                    results2
                  ) {
                    if (err2) throw err2;
                    var insertParams = [user.id, sns_id, sns_type, sns_name];
                    db.query(queries.SNS_INFO_INSERT, insertParams, function(err3, results3) {
                      if (err3) throw err3;
                      done(err3, user, {
                        message: "Login Success with google & social linked successfully"
                      });
                    });
                  });
                } else {
                  /* 기존에 가입한 계정(이메일)이 없는 경우 -> 신규가입 후 구글 연동  */
                  var user_id = shortid.generate();
                  var user_password = bcrypt.hashSync(`${sns_id}__${sns_email}`, 10);

                  var insertParams = [user_id, sns_name, sns_email, user_password];
                  db.query(queries.USER_INSERT, insertParams, function(err2, results2) {
                    if (err2) throw err2;
                    db.query(queries.USER_UPDATE_SNS_LINK_ACTIVATION_WHERE_ID, [user_id], function(
                      err3,
                      results3
                    ) {
                      if (err3) throw err3;
                      var insertParams2 = [user_id, sns_id, sns_type, sns_name];
                      db.query(queries.SNS_INFO_INSERT, insertParams2, function(err4, results4) {
                        if (err4) throw err4;
                        db.query(queries.USER_SELECT_ONE_FOR_ID, [user_id], function(
                          err5,
                          results5
                        ) {
                          var user = results5[0];
                          done(err5, user, {
                            message: "Signup success & social linked successfull"
                          });
                        });
                      });
                    });
                  });
                }
              });
            } // email false
          }
        });
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
      function(accessToken, refreshToken, profile, done) {
        var data = profile._json;
        // github profile에 email이 없다면 null값이 넘어옴
        if (data.email) {
          db.query(queries.USER_SELECT_ONE_FOR_LOGIN, [data.email], function(err, result) {
            if (err) throw err;
            var user = result[0];
            if (user) {
            }
          });
        } else {
          console.log(data.login);
        }
      }
    )
  );
  return passport;
};
