const mysql = require("mysql");
const util = require("util");
const config = require("../config/_key.json").db;
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});
pool.query = util.promisify(pool.query);
module.exports = pool;
