module.exports = function(app) {
  var passport = require("passport");
  var LocalStrategy = require("passport-local").Strategy;
  var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

  var GOOGLE_CREDENTIALS = require("../config/google.json");

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
        usernameField: "userEmail",
        passwordField: "userPassword"
      },
      function(username, password, done) {
        db.query(queries.USER_SELECT_ONE_FOR_LOGIN, [username], function(err, result) {
          if (err) throw err;
          var user = result[0];
          if (user) {
            if (bcrypt.compareSync(password, user.password)) {
              return done(null, user, { message: "Login Success" });
            } else {
              return done(null, false, { message: "Incorrect password." });
            }
          } else {
            return done(null, false, { message: "Incorrect username." });
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
        var displayName = profile.displayName;
        var email = profile.emails[0].value;
        db.query(queries.USER_SELECT_ONE_FOR_LOGIN, [email], function(err, result) {
          if (err) throw err;
          var user = result[0];
          if (user) {
            db.query(
              queries.USER_UPDATE_EXISTS_USER_LOGIN_GOOGLE,
              [displayName, profile.id, email],
              function(err1, result) {
                if (err1) throw err1;
                return done(err, user, {
                  message: "Login Success with Google & Already Exists Email"
                });
              }
            );
          } else {
            var inputParams = [
              shortid.generate(),
              email,
              bcrypt.hashSync("dummy", 10),
              displayName,
              profile.id
            ];
            console.log("inputParams", inputParams);
            db.query(queries.USER_INSERT_WITH_GOOGLE, inputParams, function(err2, result) {
              if (err2) throw err2;
              db.query(queries.USER_SELECT_ONE_FOR_ID, [result.insertId], function(err3, result) {
                if (err3) throw err3;
                var user = result[0];
                if (user) {
                  return done(err3, user, { message: "SignUp with Google & Login" });
                }
              });
            });
          }
        });
      }
    )
  );
  return passport;
};
