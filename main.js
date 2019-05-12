var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var FileStore = require("session-file-store")(session);

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

app.get("/", function(req, res, next) {
  res.render("common", { content: "login", dummy: "qwerty" });
});
app.listen(3002);
