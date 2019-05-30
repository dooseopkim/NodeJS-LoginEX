$(function() {
  var updateBtn = $(".js__updatebtn");
  var boardId = $("#boardId").val();

  var _updateBtnClickHandler = function() {
    if (confirm("글을 수정하시겠습니까?")) {
      location.href = `/board/p/${boardId}`;
    }
  };

  var editor = new tui.Editor({
    el: document.querySelector("#editSection"),
    initialValue: contents,
    viewOnly: true,
    height: "800px"
  });

  updateBtn.on("click", _updateBtnClickHandler);
});
