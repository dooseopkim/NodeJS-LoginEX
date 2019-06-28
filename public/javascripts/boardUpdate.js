const FILE_SAVE_URL = "/images";
const BOARD_POST_URL = "/board/p";

const GET_METHOD = "GET";
const POST_METHOD = "POST";
const PUT_METHOD = "PUT";
const DELETE_METHOD = "DELETE";

const SERVER_FAIL_MESSAGE = "Connect to server failed";

// const boardId = document.getElementById("boardId").value;
// const userId = document.getElementById("userId").value;
// const title = document.getElementById("title").value;
// const category = document.getElementById("category").value;

/* 게시글 수정버튼 클릭 */
const _updateBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.target;
  console.log(target);
};
/* 게시글 수정 Proc */

/* 게시글 삭제버튼 클릭 */
const _delBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.target;
  console.log(target);
};
/* 게시글 삭제 Proc */

/* 취소 버튼클릭 */
const _cancelBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.target;
  console.log(target);
};
/* TUI editor 이미지 파일 저장 Proc */
const _saveFile = function(blob) {
  console.log(blob);
  const xhr = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {
    let fileInfo = {
      size: blob.size,
      fileName: blob.name,
      contentType: blob.type
    };
    let reader = new FileReader();
    reader.onload = function(evt) {
      console.log(evt.target.result);
      fileInfo.file = evt.target.result;

      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return false;
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(SERVER_FAIL_MESSAGE);
        }
      };
      xhr.open(POST_METHOD, FILE_SAVE_URL, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.responseType = "json";
      xhr.send(JSON.stringify(fileInfo));
    };
    reader.readAsDataURL(blob);
  });
};

/* 초기화 함수 */
const _init = function() {
  const updateBtn = document.querySelector(".js__updatebtn");
  const delBtn = document.querySelector(".js__deletebtn");
  const cancelBtn = document.querySelector(".js__cancelbtn");

  if (updateBtn) updateBtn.onclick = _updateBtnClickHandler;
  if (delBtn) delBtn.onclick = _delBtnClickHandler;
  if (cancelBtn) cancelBtn.onclick = _cancelBtnClickHandler;

  /* TUI editor 설정 */
  var editor = new tui.Editor({
    el: document.querySelector("#editSection"),
    initialValue: contents,
    initialEditType: "markdown",
    previewStyle: "vertical",
    height: "800px",
    exts: ["scrollSync"],
    language: "ko_KR",
    hooks: {
      addImageBlobHook: function(blob, callback) {
        _saveFile(blob)
          .then(function(msg) {
            console.log(msg);
            callback(msg, "alt text");
          })
          .catch(function(msg) {
            alert(msg);
          });
      }
    }
  });
};

window.onload = _init;
// $(function() {
//   var FILE_SAVE_URL = "/images";
//   var BOARD_POST_URL = "/board/p";
//   var updateBtn = $(".js__updatebtn");
//   var deleteBtn = $(".js__deletebtn");
//   var cancelBtn = $(".js__cancelbtn");

//   var boardId = $("#boardId").val();
//   var userId = $("#userId").val();

//   var category = $("#title");
//   var category = $("#category");

//   updateBtn.on("click", function() {
//     var params = {
//       userId: userId,
//       titleVal: title.val(),
//       categoryVal: category.val(),
//       editorVal: editor.getMarkdown()
//     };
//     console.log(params.editorVal);
//     $.ajax({
//       type: "PUT",
//       url: `${BOARD_POST_URL}/${boardId}`,
//       dataType: "JSON",
//       data: { data: JSON.stringify(params) },
//       success: function(result) {
//         if (result.flag) {
//           location.href = `/board/${result.boardId}`;
//         } else {
//           alert(result.msg);
//         }
//       }
//     });
//   });
//   deleteBtn.on("click", function() {
//     var params = {
//       userId: userId,
//       boardId: boardId
//     };
//     $.ajax({
//       type: "DELETE",
//       url: `${BOARD_POST_URL}/${boardId}`,
//       dataType: "JSON",
//       data: { data: JSON.stringify(params) },
//       success: function(result) {
//         if (result.flag) {
//           location.href = `${result.location}`;
//         } else {
//           alert(result.msg);
//         }
//       }
//     });
//   });
//   var save_file = function(blob) {
//     return new Promise(function(resolve, reject) {
//       var file_info = {
//         size: blob.size,
//         file_name: blob.name,
//         content_type: blob.type
//       };
//       var reader = new FileReader();
//       reader.onload = function(evt) {
//         file_info.file = evt.target.result;
//         $.ajax({
//           type: "POST",
//           url: FILE_SAVE_URL,
//           datatype: "JSON",
//           data: { data: JSON.stringify(file_info) },
//           success: function(result) {
//             if (result.flag) {
//               console.log(result.msg);
//               resolve(result.url);
//             } else {
//               reject(result.msg);
//             }
//           }
//         });
//       };
//       reader.readAsDataURL(blob);
//     });
//   };

//   var editor = new tui.Editor({
//     el: document.querySelector("#editSection"),
//     initialValue: contents,
//     initialEditType: "markdown",
//     previewStyle: "vertical",
//     height: "800px",
//     exts: ["scrollSync"],
//     language: "ko_KR",
//     hooks: {
//       addImageBlobHook: function(blob, callback) {
//         save_file(blob)
//           .then(function(msg) {
//             console.log(msg);
//             callback(msg, "alt text");
//           })
//           .catch(function(msg) {
//             alert(msg);
//           });
//       }
//     }
//   });
// });
