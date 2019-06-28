const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  let resParams = {};

  const fmsg = req.flash();
  console.log("=================================");
  console.log("fmsg", fmsg);
  console.log("=================================");
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
  return false;
});
module.exports = router;
