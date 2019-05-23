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
  return dateTime.toLocaleDateString("ko-KR", options).replace("-", "");
};
exports.removeTmps = (tmpDir, tmpFile) => {
  setTimeout((tmpDir, tmpFile) => {
    console.log(tmpDir);
    console.log(tmpFile);
    require("fs").unlinkSync(tmpFile);
    tmpDir.removeCallback();
  }, 2000);
};
