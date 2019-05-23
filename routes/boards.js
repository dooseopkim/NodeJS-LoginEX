const express = require("express");
const router = express.Router();
const pool = require("../lib/db");
const queries = require("../lib/queries");

/* 게시글 작성 화면으로 이동 */
router.get("/", async (req, res, next) => {
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

module.exports = router;
