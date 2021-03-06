$(function() {
  var FILE_SAVE_URL = "/images";
  var BOARD_POST_URL = "/board/p";
  var submitBtn = $(".js__submitbtn");
  var reserBtn = $(".js__resetbtn");
  var cancelBtn = $(".js__cancelbtn");

  var title = $("#title");
  var category = $("#category");

  submitBtn.on("click", function() {
    var params = {
      titleVal: title.val(),
      categoryVal: category.val(),
      editorVal: editor.getMarkdown()
    };
    console.log(params.editorVal);
    $.ajax({
      type: "POST",
      url: BOARD_POST_URL,
      dataType: "JSON",
      data: { data: JSON.stringify(params) },
      success: function(result) {
        console.log(result);
        if (result.flag) {
          location.href = `/board/${result.boardId}`;
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
