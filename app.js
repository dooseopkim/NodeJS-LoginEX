const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const compression = require("compression");
const flash = require("connect-flash");
const logger = require("morgan");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(
  express.static("public", {
    setHeaders: (res, path, stat) => {
      res.set("x-timestamp", Date.now());
    }
  })
);
app.use(cookieParser());
// PayloadTooLargeError fix
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(compression());
app.use(flash());
app.use(
  session({
    store: new FileStore(),
    secret: "dooseop",
    resave: false,
    saveUninitialized: true
  })
);
const passport = require("./lib/strategies")(app);

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user")(passport);
const signinRouter = require("./routes/signin");
const boardsRouter = require("./routes/boards");
const imagesRouter = require("./routes/images");

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/signin", signinRouter);
app.use("/board", boardsRouter);
app.use("/images", imagesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});
// app.listen(3000);
module.exports = app;
