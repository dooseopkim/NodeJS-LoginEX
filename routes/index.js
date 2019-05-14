var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  var isLogined = true;
  var loginParams = {};
  if (req.user) {
    loginParams = req.user;
  } else {
    isLogined = false;
  }
  res.render("common", { isLogined: isLogined, loginParams: JSON.stringify(loginParams) });
});
module.exports = router;
