const mysql = require("mysql");
const util = require("util");
const commonJS = require("./common");
const config = commonJS.requireErrorCatch("../config/_key.json", "../config/keyTemplate.json");
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
});
pool.query = util.promisify(pool.query);
module.exports = pool;
