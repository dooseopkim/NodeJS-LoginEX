const express = require("express");
const router = express.Router();
const pool = require("../lib/db");
const queries = require("../lib/queries");
const commonJS = require("../lib/common");

router.get("/", async (req, res, next) => {
  res.send("hello");
});

/* 댓글 입력 */
router.post("/", async (req, res, next) => {
  console.log(req.body);
  let status = req.body.status;
  let boardId = req.body.boardId;
  let contents = commonJS.escape(req.body.comments);
  let userId = req.user.id;

  let rows, pCommentId, pComment, tComment, insertId, insertParams, resParams;
  if (status === 0) {
    /* 첫 댓글 */
    insertParams = [boardId, contents, userId];
    try {
      // 댓글 저장
      rows = await pool.query(queries.COMMENT_INSERT, insertParams);
      if (rows.affectedRows === 1) insertId = rows.insertId;
    } catch (e) {
      throw e;
    }
  } else {
    pCommentId = req.body.commentParentId.split("-")[1];
    try {
      // 기존 댓글들 sequence 수정
      rows = await pool.query(
        queries.COMMENT_SELECT_ONE_GROUP_ID_AND_SEQUENCE_WHERE_COMMENT_PARENT_ID,
        [pCommentId]
      );
      pComment = rows[0];

      insertParams = [pComment.group_id, pComment.group_seq];
      rows = await pool.query(
        queries.COMMENT_UPDATE_GROUP_SEQUENCES_PLUS_ONE_WHERE_BIGGER_THAN_PARENT_SEQUENCE,
        insertParams
      );

      // 신규 대댓글 저장
      insertParams = [boardId, contents, userId, pComment.group_id, pComment.group_seq + 1];
      rows = await pool.query(queries.COMMENT_REPLY_INSERT, insertParams);
      if (rows.affectedRows === 1) insertId = rows.insertId;
    } catch (e) {
      throw e;
    }
  }

  if (insertId) {
    try {
      // 저장한 댓글 조회
      rows = await pool.query(queries.COMMENT_JOIN_USER_SELECT_ONE_WHERE_COMMENT_ID, [insertId]);
      tComment = rows[0];
    } catch (e) {
      throw e;
    }
  }

  resParams = {
    id: tComment.id,
    username: tComment.username,
    modifyDate: tComment.modify_date,
    contents: commonJS.unescape(tComment.contents),
    like: tComment.like,
    unlike: tComment.unlike,
    depth: tComment.group_seq === 0 ? " " : "depth"
  };
  console.log(resParams);
  res.json(resParams);
});
router.delete("/:commentId", async (req, res, next) => {
  let delId = req.params.commentId;
  resParams = {
    delId: delId,
    word: "hello"
  };
  res.json(resParams);
});
router.get("/b/:boardId", async (req, res, next) => {
  let boardId = req.params.boardId;
  let rows, commentList, resParams;
  try {
    rows = await pool.query(queries.COMMENT_JOIN_USER_SELECT_ALL_WHERE_BOARD_ID, [boardId]);
    commentList = rows;
  } catch (e) {
    throw e;
  }
  commentList.forEach(comment => {
    comment.depth = comment.group_seq === 0 ? " " : "depth";
    comment.modifyDate = commonJS.getDateStringFull(comment.modify_date);
  });
  resParams = {
    commentList: commentList
  };
  res.json(resParams);
});
module.exports = router;
