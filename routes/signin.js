var express = require("express");
var router = express.Router();
var db = require("../lib/db");
var queries = require("../lib/queries");

router.post("/validation/username", function(req, res, next) {
  db.query(queries.USER_SELECT_ONE_WHERE_USERNAME, [req.body.username], function(err, results) {
    if (err) throw err;
    var isExist = results.length === 1 ? true : false;
    res.json({ isExist: isExist });
  });
});
router.post("/validation/email", function(req, res, next) {
  if (!_emailValidate(req.body.email)) {
    res.json({ isExist: true });
    return false;
  }
  db.query(queries.USEER_SELECT_ONE_WHERE_EMAIL, [req.body.email], function(err, results) {
    if (err) throw err;
    var isExist = results.length === 1 ? true : false;
    res.json({ isExist: isExist });
  });
});
var _emailValidate = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
module.exports = router;
