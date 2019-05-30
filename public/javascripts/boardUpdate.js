$(function() {
  var FILE_SAVE_URL = "/images";
  var BOARD_POST_URL = "/board/p";
  var updateBtn = $(".js__updatebtn");
  var deleteBtn = $(".js__deletebtn");
  var cancelBtn = $(".js__cancelbtn");

  var boardId = $("#boardId").val();
  var userId = $("#userId").val();

  var title = $("#title");
  var category = $("#category");

  updateBtn.on("click", function() {
    var params = {
      userId: userId,
      titleVal: title.val(),
      categoryVal: category.val(),
      editorVal: editor.getMarkdown()
    };
    console.log(params.editorVal);
    $.ajax({
      type: "PUT",
      url: `${BOARD_POST_URL}/${boardId}`,
      dataType: "JSON",
      data: { data: JSON.stringify(params) },
      success: function(result) {
        if (result.flag) {
          location.href = `/board/${result.boardId}`;
        } else {
          alert(result.msg);
        }
      }
    });
  });
  deleteBtn.on("click", function() {
    var params = {
      userId: userId,
      boardId: boardId
    };
    $.ajax({
      type: "DELETE",
      url: `${BOARD_POST_URL}/${boardId}`,
      dataType: "JSON",
      data: { data: JSON.stringify(params) },
      success: function(result) {
        if (result.flag) {
          location.href = `${result.location}`;
        } else {
          alert(result.msg);
        }
      }
    });
  });
  var save_file = function(blob) {
    return new Promise(function(resolve, reject) {
      var file_info = {
        size: blob.size,
        file_name: blob.name,
        content_type: blob.type
      };
      var reader = new FileReader();
      reader.onload = function(evt) {
        file_info.file = evt.target.result;
        $.ajax({
          type: "POST",
          url: FILE_SAVE_URL,
          datatype: "JSON",
          data: { data: JSON.stringify(file_info) },
          success: function(result) {
            if (result.flag) {
              console.log(result.msg);
              resolve(result.url);
            } else {
              reject(result.msg);
            }
          }
        });
      };
      reader.readAsDataURL(blob);
    });
  };

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
        save_file(blob)
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
});
