var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  var resParams = {};

  var fmsg = req.flash();
  if (fmsg.success) {
    resParams.msg = fmsg.success;
  }
  if (req.user) {
    resParams.loginUser = JSON.stringify(req.user);
    resParams.isLogined = true;
  } else {
    resParams.isLogined = false;
  }
  res.render("common", resParams);
});
module.exports = router;
