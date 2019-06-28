const express = require("express");
const router = express.Router();
const pool = require("../lib/db");
const queries = require("../lib/queries");
const commonJS = require("../lib/common");
const shortid = require("shortid");
const fs = require("fs");

router.post("/", async (req, res, next) => {
  let dateObj = new Date();
  let SAVE_DIR = commonJS.getSaveDir(dateObj);

  // let rawFile = JSON.parse(req.body.data);
  console.log(req.body);
  res.json("hello");
  // let realFile64 = rawFile.file.split(";")[1].split(",")[1];

  // let save_file_name = dateObj.getTime() + shortid.generate();
  // let args = [rawFile.file_name, save_file_name, rawFile.content_type, rawFile.size];

  // let resParams = {};
  // try {
  //   /* file_info table insert */
  //   let rows = await pool.query(queries.FILE_INSERT, args);

  //   /* insert fail? */
  //   if (rows.affectedRows !== 1) {
  //     resParams.flag = false;
  //     resParams.msg = "DB Error";
  //     res.json(resParams);
  //     return false;
  //   }

  //   /* doesn't exist directory ? */
  //   if (!fs.existsSync(SAVE_DIR)) {
  //     fs.mkdirSync(SAVE_DIR);
  //   }

  //   fs.writeFileSync(`${SAVE_DIR}/${save_file_name}`, realFile64, "base64");
  //   resParams.flag = true;
  //   resParams.msg = "success";
  //   resParams.url = `http://localhost:3000/images/${rows.insertId}`;
  //   res.json(resParams);
  // } catch (e) {
  //   throw e;
  // }
});
router.get("/:id", async (req, res, next) => {
  let fileId = req.params.id;
  let rows, file;
  try {
    /* view count++ */
    rows = await pool.query(queries.FILE_UPDATE_ONE_WHERE_ID_COUNT_PLUS, [fileId]);

    /* get file info */
    rows = await pool.query(queries.FILE_SELECT_ONE_WHERE_ID, [fileId]);
    file = rows[0];

    const SAVE_DIR = commonJS.getSaveDir(new Date(file.create_date));
    const FULL_FILE_INFO = `${SAVE_DIR}/${file.save_file_name}`;

    const rawFile = fs.readFileSync(FULL_FILE_INFO);
    res.writeHead(200, {
      "Content-Type": file.content_type,
      "Content-Transfer-Encoding": "binary"
    });
    res.end(rawFile);
  } catch (e) {
    throw e;
  }
});
// router.get("/download/:id", async (req, res, next) => {
//   let fileId = req.params.id;
//   let rows, file;

//   let tmpDir, tmpFile;
//   try {

//     rows = await pool.query(queries.FILE_SELECT_ONE_WHERE_ID, [fileId]);
//     file = rows[0];

//     const SAVE_DIR = utilJS.getSaveDir(new Date(file.create_date));
//     const FULL_FILE_INFO = `${SAVE_DIR}/${file.save_file_name}`;
//     var tmpobj = tmp.fileSync();
//     console.log("File: ", tmpobj.name);
//     console.log("Filedescriptor: ", tmpobj.fd);
//     fs.copyFileSync(FULL_FILE_INFO, tmpobj.name + "." + file.content_type.split("/")[1]);
//     // If we don't need the file anymore we could manually call the removeCallback
//     // But that is not necessary if we didn't pass the keep option because the library
//     // will clean after itself.
//     tmpobj.removeCallback();

//     //  파일을 확장자 없이 파일로만 보관한다.. 뭔가 사용자가 업로드한 사진을 내가 볼 수 있다는게 꺼림칙해서..
//     //  임시 경로를 만들고 확장자를 붙인 파일을 복사한뒤 그 파일을 다운로드 할 수 있도록 해주자
//     //  다운로드 완료 후 파일을 삭제하면 임시 경로는 사라진다. removeCallback() 함수가 실행되는듯

//     // 1. 임시 경로 생성
//     // tmpDir = tmp.dirSync();
//     // tmpFile = `${tmpDir.name}/${file.save_file_name}.${file.content_type.split("/")[1]}`;

//     // // 2. 다운로드 요청 파일을 확장자 포함한 채로 임시 경로로 복사
//     // // !! 파일이 있을때만 해주자
//     // if (fs.existsSync(FULL_FILE_INFO)) {
//     //   fs.copyFileSync(FULL_FILE_INFO, tmpFile);
//     //   // 3. 응답으로 임시 파일을 전송, 이름은 원본 파일 이름으로
//     //   res.download(tmpFile, file.file_name);
//     //   fs.unlinkSync(tmpFile);
//     //   tmpDir.removeCallback();
//     // }
//   } catch (e) {
//     throw e;
//   }
//   //==========================================================================================================
//   tmp.setGracefulCleanup();

//   const FULL_FILE_INFO = `${SAVE_DIR}/${file.save_file_name}.${file.content_type.split("/")[1]}`;

//   res.download(FULL_FILE_INFO, file.file_name);
//   res.setHeader("Content-Disposition", "attachment; filename=" + file.file_name);
//   res.setHeader("Content-Transfer-Encoding", "binary");
//   res.setHeader("Content-Type", "application/octet-stream");
//   res.sendFile(FULL_FILE_INFO);
//   var options = {
//     root: SAVE_DIR,
//     dotfiles: "deny",
//     headers: {
//       "Content-type": file.content_type,
//       "Content-Disposition": "attachment; filename='" + file.file_name + "'",
//       "x-timestamp": Date.now(),
//       "x-sent": true
//     }
//   };
//   console.log(options);
//   res.sendFile(file.save_file_name, options, err => {
//     if (err) {
//       console.log(err);
//     }
//   });

//   res.download(FULL_FILE_INFO, file.file_name);

//   res.sendFile(FULL_FILE_INFO);

//   const img = fs.readFileSync(FULL_FILE_INFO);
//   res.writeHead(200, { "Content-Type": file.content_type });
//   res.end(img);
// });

module.exports = router;
