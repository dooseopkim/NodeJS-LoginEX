exports.getBaseDir = () => {
  return "D:\\images";
};
exports.getSaveDir = dateObj => {
  let today = "";
  today += dateObj.getFullYear();
  today += dateObj.getMonth() < 10 ? `0${dateObj.getMonth()}` : dateObj.getMonth();
  today += dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
  const BASE_DIR = "D:\\images";
  const SAVE_DIR = `${BASE_DIR}/${today}`;
  return SAVE_DIR;
};
exports.getDateString = dateTime => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };
  return dateTime.toLocaleDateString("ko-KR", options).replace(/-/g, ".");
};
exports.removeTmps = (tmpDir, tmpFile) => {
  setTimeout((tmpDir, tmpFile) => {
    console.log(tmpDir);
    console.log(tmpFile);
    require("fs").unlinkSync(tmpFile);
    tmpDir.removeCallback();
  }, 2000);
};
exports.requireErrorCatch = (path, backupPath) => {
  let returnModule;
  try {
    returnModule = require(path);
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
      throw err;
    }
    returnModule = require(backupPath);
  }
  return returnModule;
};
exports.escape = str => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;")
    .replace(/"/g, "&quot;")
    .replace(/\$/g, "&#36;")
    .replace(/```/g, "~~~")
    .replace(/`/g, "\\`")
    .replace(/\/script/gi, "\\/script");
};
exports.unescape = str => {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#36;/g, "\\$");
};
exports.escapeGrave = str => {
  return str.replace(/```/g, "~~~").replace(/`/g, "\\`");
};
