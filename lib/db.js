var dbconfig = require("../config/db.json");
var mysql = require("mysql");
var db = mysql.createConnection({
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database
});
db.query("SET NAMES utf8");
module.exports = db;
