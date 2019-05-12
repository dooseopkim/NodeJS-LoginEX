var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var compression = require("compression");
var flash = require("connect-flash");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  express.static("public", {
    setHeaders: function(res, path, stat) {
      res.set("x-timestamp", Date.now());
    }
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(flash());
app.use(
  session({
    store: new FileStore(),
    secret: "keyboard",
    resave: false,
    saveUninitialized: true
  })
);
var passport = require("./lib/strategies")(app);

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user")(passport);

app.use("/", indexRouter);
app.use("/user", userRouter);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.use(function(req, res, next) {
  res.status(404).send("Sorry cant find that!");
});
// app.get("/", function(req, res, next) {
//   res.render("common", { content: "login", dummy: "qwerty" });
// });
// app.get("/user/signin", function(req, res, next) {
//   res.render("common", { content: "signin", dummy: "qwerty" });
// });
app.listen(3002);
