module.exports = function(app) {
  var passport = require("passport");
  var LocalStrategy = require("passport-local").Strategy;
  var db = require("./db");
  var queries = require("./queries");
  var bcrypt = require("bcrypt");

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
  return passport;
};
