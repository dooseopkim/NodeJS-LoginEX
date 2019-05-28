"use stritct";

const express = require("express");
const router = express.Router();
const pool = require("../lib/db");
const queries = require("../lib/queries");
const commonJS = require("../lib/common");
const createError = require("http-errors");
const sanitizeHtml = require("sanitize-html");

/* 게시글 작성 화면으로 이동 */
router.get("/", async (req, res, next) => {
  let user = req.user;
  /* 1. 로그인 여부 검증 */
  if (!user) {
    res.send(`<script>alert("로그인이 필요합니다");location.href="/user/login"</script>`);
    return false;
  }
  /* 2. 로그인 정보 전송 */
  let resParams = {
    isLogined: true,
    username: user.username, // 작성자가 됨
    content: "bbsAdd" // 렌더링 페이지
  };
  res.render("common", resParams);
});

/* 게시글 등록 */
router.post("/", async (req, res, next) => {
  let user = req.user;
  /* 1. 로그인 여부 검증 */
  if (!user) {
    res.send(`<script>alert('로그인이 필요합니다');location.href='/user/login'</script>`);
    return false;
  }
  /* 2. 게시글 정보 검증 */
  let boardData = JSON.parse(req.body.data);
  console.log(boardData);
  let resParams = {};
  if (boardData.titleVal === "" || boardData.editorVal === "" || boardData.categoryVal === "") {
    resParams.flag = false;
    resParams.msg = "입력하지 않은 값이 존재합니다.";
    res.json(resParams);
    return false;
  }
  /* 3. 게시글 DB 저장 */
  let insertParams = [
    boardData.titleVal,
    commonJS.escape(boardData.editorVal),
    boardData.categoryVal,
    req.user.id
  ];
  console.log(insertParams);
  let rows;
  try {
    rows = await pool.query(queries.BOARD_INSERT, insertParams);
    if (rows.affectedRows === 1) {
      resParams.flag = true;
      resParams.boardId = rows.insertId;
    } else {
      resParams.flag = false;
      resParams.msg = "게시글 작성 실패. 다시 시도해 주세요.";
    }
    res.json(resParams);
  } catch (e) {
    throw e;
  }
});
/* 게시글 상세보기 */
router.get("/:boardId", async (req, res, next) => {
  /* 1. 로그인 여부 검증 */
  let user = req.user;
  if (!user) {
    res.send(`<script>alert('로그인이 필요합니다');location.href='/user/login'</script>`);
    return false;
  }
  //============================================================================
  if (req.params.boardId === "test") {
    let resParams = {
      boardId: "test",
      title: "test",
      contents: "test",
      category: "test",
      userId: "test",
      username: "test",
      createDate: "test",
      isLogined: true,
      content: "bbsViewTest"
    };
    res.render("common", resParams);
    return false;
  }
  //============================================================================
  /* 2. 게시글 조회 */
  let boardId = req.params.boardId;
  let rows, board;
  try {
    /* 조회수 1 업 */
    rows = await pool.query(queries.BOARD_UPDATE_VIEW_COUNT_UP_WHERE_ID, [boardId]);
    /* 게시글 DB 조회 */
    rows = await pool.query(queries.BOARD_JOIN_USER_SELECT_ONE_WHERE_ID, [boardId]);
    board = rows[0];
    let resParams = {
      boardId: board.board_id,
      title: board.title,
      // contents: JSON.stringify(board.contents),
      // contents: JSON.stringify(board.contents.split("\n")),
      contents: commonJS.unescape(board.contents),
      category: board.category,
      userId: board.user_id,
      username: board.username,
      createDate: commonJS.getDateString(board.create_date),
      isLogined: true,
      content: "bbsView" // 렌더링 페이지
    };
    console.log(resParams);
    res.render("common", resParams);
  } catch (err) {
    throw err;
  }
});

router.get("/c/:categoryId/p/:pageNum", async (req, res, next) => {
  /* 1. 로그인 여부 검증 */
  let user = req.user;
  if (!user) {
    res.send(`<script>alert('로그인이 필요합니다');location.href='/user/login'</script>`);
    return false;
  }

  let rows;

  /* 2. 카테고리 정보 가져오기 */
  const categoryId = req.params.categoryId;
  let categoryInfo;
  try {
    rows = await pool.query(queries.BOARD_CATEGORY_SELECT_ONE_WHERE_ID, [categoryId]);
    if (rows.length === 0) {
      next(createError(404));
    }
    categoryInfo = {
      categoryId: categoryId,
      categoryDescription: rows[0].description
    };
  } catch (e) {
    throw e;
  }

  /* 3. 페이징 */
  const currentPageNum = Number(req.params.pageNum); // 현재 페이지 번호
  let listStartNum; // DB limit 시작 번호
  let listSize = 15; // 한 페이지당 보여질 게시글 수
  let pageSize = 10; // 페이징 네비게이션 수
  let startPageNum, endPageNum; // 페이징 네비게이션 시작, 끝 번호
  let totalPageNum; // 전체 페이지 수 ( 전체 게시글 수 / 한 페이지당 보여질 게시글 수) 의 올림

  try {
    // 해당 카테고리 전체 게시글 수
    rows = await pool.query(queries.BOARD_CATEGORY_COUNT_ALL_WHERE_CATEGORY_ID, [categoryId]);
    totalPageNum = Math.ceil(rows[0].totalCnt / listSize);
  } catch (e) {
    throw e;
  }

  // 없는 페이지 요청했을 때
  if (currentPageNum > totalPageNum) {
    next(createError(404));
    return false;
  }

  // LIMIT ? 에 들어갈 숫자
  if (currentPageNum === "1") {
    listStartNum = 0;
  } else {
    listStartNum = (currentPageNum - 1) * listSize;
  }

  startPageNum = (Math.ceil(currentPageNum / pageSize) - 1) * pageSize + 1;
  endPageNum = startPageNum + pageSize - 1;
  // 전체 페이지 수가 페이징 네비게이션 끝 번호보다 작을 때
  if (totalPageNum < endPageNum) {
    endPageNum = totalPageNum;
  }

  let pageInfo = {
    currentPageNum: currentPageNum,
    startPageNum: startPageNum,
    endPageNum: endPageNum,
    totalPageNum: totalPageNum
  };

  /* 4. 게시글 목록 가져오기 */
  let boardList;
  try {
    rows = await pool.query(
      queries.BOARD_JOIN_USER_JOIN_CATEGORY_ALL_WHERE_CATEGORY_ID_LIMIT_OFFSET,
      [categoryId, listStartNum, listSize]
    );
    boardList = rows;
    boardList.forEach(board => {
      board.create_date = commonJS.getDateString(board.create_date);
    });
  } catch (e) {
    throw e;
  }
  let resParams = {
    categoryInfo: JSON.stringify(categoryInfo),
    boardList: JSON.stringify(boardList),
    pageInfo: JSON.stringify(pageInfo),
    isLogined: true,
    content: "bbsList"
  };
  console.log(resParams);
  res.render("common", resParams);
});

module.exports = router;
