const express = require("express");
const router = express.Router();
const pool = require("../lib/db");
const queries = require("../lib/queries");

router.get("/", async (req, res, next) => {
  /* 게시글 작성 화면으로 이동 */
  let resParams = {};
  let user = req.user;
  /* 1. 로그인 여부 검증 */
  if (!user) {
    res.send(`<script>alert('로그인이 필요합니다');location.href='/user/login'</script>`);
    return false;
  }
  /* 2. 로그인 정보 전송 */
  resParams.isLogined = true;
  resParams.username = user.username; // 작성자가 됨
  resParams.content = "bbsAdd"; // 렌더링 페이지
  res.render("common", resParams);
});

router.get("/ca/:category_id", (req, res, next) => {
  const user = req.user;
  if (!user) {
    res.send(`<script>alert('로그인이 필요합니다');location.href='/user/login'</script>`);
    return false;
  }
  const category = req.params.category_id;
  res.send(`${category}게시판`);
});

router.get("/file", (req, res, next) => {
  let resParams = {};

  // const fmsg = req.flash();
  // if (fmsg.success) {
  //   resParams.msg = fmsg.success;
  // }
  // if (req.user) {
  //   resParams.loginUser = JSON.stringify(req.user);
  //   resParams.isLogined = true;
  // } else {
  //   resParams.isLogined = false;
  // }
  resParams.content = "editor";
  res.render("common", resParams);
});
router.post("/file", (req, res, next) => {
  var originFile = req.body.file;
  var ext = originFile.split(";")[0].split(":")[1];
  var base64Data = originFile.split(";")[1].split(",")[1];
  var timeStamp = new Date().getTime();
  var SAVE_PATH = `/images/${timeStamp}.${ext.split("/")[1]}`;

  require("fs").writeFile(`public${SAVE_PATH}`, base64Data, "base64", function(err) {
    if (err) throw err;
    res.json(SAVE_PATH);
  });
});

module.exports = router;
