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
              console.log("Login Success");
              return done(null, user, { message: "Login Success" });
            } else {
              console.log("Incorrect Password.");
              return done(null, false, { message: "Incorrect password." });
            }
          } else {
            console.log("Incorrect Username or Email.");
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
        var data = profile._json;
        var displayName = data.name;
        var email = data.email;
        db.query(queries.USER_SELECT_ONE_FOR_LOGIN, [email], function(err, result) {
          if (err) throw err;
          var user = result[0];
          if (user) {
            // Already exists account with same email
            if (user.googleid) {
              return done(err, user, { message: "Login Success with Google" });
            } else {
              var updateParams = [displayName, profile.id, user.id];
              db.query(queries.USER_UPDATE_EXISTS_USER_LOGIN_GOOGLE, updateParams, function(
                err1,
                updateResult
              ) {
                if (err1) throw err1;
                db.query(queries.USER_SELECT_ONE_FOR_LOGIN, [user.id], function(err2, result2) {
                  if (err2) throw err2;
                  var user2 = result2[0];
                  return done(err2, user2, {
                    message: "Login Success with Google & Already Exists Email"
                  });
                });
              });
            }
          } else {
            var inputParams = [
              shortid.generate(),
              email,
              bcrypt.hashSync("dummy", 10),
              displayName,
              profile.id
            ];
            db.query(queries.USER_INSERT_WITH_GOOGLE, inputParams, function(err1, insertResult) {
              if (err1) throw err1;
              db.query(queries.USER_SELECT_ONE_FOR_LOGIN, [insertResult.insertId], function(
                err2,
                result2
              ) {
                if (err2) throw err2;
                var user = result2[0];
                return done(err2, user, { message: "SignUp with Google & Login" });
              });
            });
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
