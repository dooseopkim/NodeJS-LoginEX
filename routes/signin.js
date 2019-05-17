const express = require("express");
const router = express.Router();
const pool = require("../lib/db");
const queries = require("../lib/queries");

router.post("/validation/username", async (req, res, next) => {
  try {
    let rows = await pool.query(queries.USER_SELECT_ONE_WHERE_USERNAME, [req.body.username]);
    let isExist = rows.length === 1 ? true : false;
    res.json({ isExist: isExist });
  } catch (e) {
    throw e;
  }
});
router.post("/validation/email", async (req, res, next) => {
  try {
    let rows = await pool.query(queries.USER_SELECT_ONE_WHERE_EMAIL, [req.body.email]);
    let isExist = rows.length === 1 ? true : false;
    res.json({ isExist: isExist });
  } catch (e) {
    throw e;
  }
});

module.exports = router;
