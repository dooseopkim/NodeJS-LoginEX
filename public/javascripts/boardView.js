/**
 * =========================================================================
 *  Templates
 * =========================================================================
 */
const REPLY_FORM_TEMPLATE = `
<form method="POST" class="form-box">
    <div class="form-group mt-4">
      <label for="comments">답글쓰기</label> 
      <textarea name="comments" cols="40" rows="5" class="form-control js__commentsText"></textarea>
    </div> 
    <div class="form-group text-right">
      <button name="submit" type="button" class="btn btn-primary px-4 js__commentSubmitBtn">제출</button>
    </div>
</form>
`;

function REPLY_TEMPLATE(commentObj) {
  return `
  <div class="comment-item ${commentObj.depth}" id="c-${commentObj.id}">
    <div class="comment-header d-flex justify-content-between align-items-center">
      <div class="left">
        <h5 class="h5 mb-0 comment-title">${commentObj.username}</h5>
        <span class="comment-date">${commentObj.modifyDate}</span>
      </div>
      <div class="right">
        <button class="d-inline-block comment-edit js__editBtn"><i class="fas fa-cog"></i></button>
        <button class="d-inline-block comment-del js__delBtn"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="comment-body"><pre>${commentObj.contents}</pre></div>
    <div class="comment-footer">
      <ul class="list-inline d-sm-flex my-0">
        <li class="list-inline-item">
          <button class="comment-like js__likeBtn"><i class="fa fa-thumbs-up"></i></button
          ><span>${commentObj.like}</span>
        </li>
        <li class="list-inline-item">
          <button class="comment-unLike js__unLikeBtn">
            <i class="fa fa-thumbs-down g-pos-rel g-top-1 g-mr-3"></i></button
          ><span>${commentObj.unlike}</span>
        </li>
        <li class="list-inline-item ml-auto">
          <button class="comment-reply js__replyBtn">
            <i class="fa fa-reply g-pos-rel g-top-1 g-mr-3"></i> Reply
          </button>
        </li>
      </ul>
    </div>
  </div>
  `;
}

/**
 * =========================================================================
 *  Handler Functions
 * =========================================================================
 */

/* Error Handler */
function _errorHandler(err) {
  console.error(err);
}

/* Update Button Click Handler (board) */
function _updateBtnClickHandler(e) {
  if (confirm("글을 수정하시겠습니까?")) {
    location.href = `/board/p/${boardId}`;
  }
  return false;
}
/* Edit Comment Button Click Handler */
function _editBtnClickHandler(e) {
  let commentItem = e.target.parentElement.parentElement.parentElement;
  console.log(commentItem);
}
/* Delete Comment Button Click Handler */
function _delBtnClickHandler(e) {
  let commentItem = e.target.parentElement.parentElement.parentElement;
  const xhr = new XMLHttpRequest();
  const url = `http://localhost:3000/comments/${commentItem.id}`;
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return false;
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log(xhr.response);
    } else {
      console.log("error");
    }
  };
  xhr.open("DELETE", url, true);
  xhr.responseType = "json";
  xhr.send();
}
/* Like Comment Button Click Handler */
function _likeBtnClickHandler(e) {
  let commentItem = e.target.parentElement.parentElement.parentElement.parentElement;
  console.log(commentItem);
}
/* UnLike Comment Button Click Handler */
function _unLikeBtnClickHandler(e) {
  let commentItem = e.target.parentElement.parentElement.parentElement.parentElement;
  console.log(commentItem);
}
/* Reply Button Click Handler */
function _replyBtnClickHandler(e) {
  let commentItem = e.target.parentElement.parentElement.parentElement.parentElement;
  if (commentItem.classList.contains("on")) {
    commentItem.querySelector("form").remove();
    commentItem.classList.remove("on");
  } else {
    commentItem.insertAdjacentHTML("beforeend", REPLY_FORM_TEMPLATE);
    commentItem.classList.add("on");
    commentItem
      .querySelector(".js__commentSubmitBtn")
      .addEventListener("click", _commentSubmitBtnClickHandler);
  }
  return false;
}
/* Comment Submit Button Click Handler */
function _commentSubmitBtnClickHandler(e) {
  let commentItem = e.target.parentElement.parentElement.parentElement;
  const boardId = document.querySelector("#boardId").value;
  const commentsText = commentItem.querySelector(".js__commentsText");
  let status, commentParentId;
  if (commentItem.classList.contains("comment-form")) {
    /* 기본 입력 폼 */
    status = 0;
    _commentSubmit(status, boardId, commentsText.value)
      .then(function(comments) {
        let commentObj = JSON.parse(comments);
        commentsText.value = "";
        commentItem.insertAdjacentHTML("beforebegin", REPLY_TEMPLATE(commentObj));
        _replyBtnListenerMapping();
      })
      .catch(_errorHandler);
    return false;
  } else {
    /* 대댓글 폼 */
    status = 1;
    commentParentId = commentItem.id;
  }
  _commentSubmit(status, boardId, commentsText.value, commentParentId)
    .then(function(comments) {
      console.log(comments);
      commentItem.classList.remove("on");
      commentItem.querySelector("form").remove();
      let commentObj = JSON.parse(comments);
      commentItem.insertAdjacentHTML("afterend", REPLY_TEMPLATE(commentObj));
      _replyBtnListenerMapping();
    })
    .catch(_errorHandler);

  return false;
}
/**
 * =========================================================================
 *  Common functions & Handler mapping
 * =========================================================================
 */

/* 댓글전송 후 값 받아옴 */
function _commentSubmit(status, boardId, comments, commentParentId) {
  let params = {
    status: status,
    boardId: boardId,
    comments: comments
  };
  // 대댓글일 경우
  if (status !== 0) {
    params.commentParentId = commentParentId;
  }

  const xhr = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return false;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject("Connect to server failed");
      }
    };
    xhr.open("POST", "/comments", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(params));
  });
}

/* 댓글목록 받아옴 */
function _getCommentList() {
  const xhr = new XMLHttpRequest();
  const url = "http://localhost:3000/comments/b/" + document.querySelector("#boardId").value;
  return new Promise(function(resolve, reject) {
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return false;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject("Connect to server failed");
      }
    };
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.send();
  });
}

/* 댓글목록 화면에 뿌려줌 */
function _commentListDrawing(data) {
  const commentForm = document.querySelector(".comment-form");

  let commentList = data.commentList;
  commentList.forEach(function(comment) {
    commentForm.insertAdjacentHTML("beforebegin", REPLY_TEMPLATE(comment));
  });
  _allCommentItemsButtonsListenerMapping();
}

/* 전체 댓글아이템 내의 버튼들 핸들러 매핑 */
function _allCommentItemsButtonsListenerMapping() {
  let commentItems = document.querySelectorAll(".comment-item");
  commentItems.forEach(function(commentItem) {
    console.log(commentItem);
    commentItem.querySelector(".js__editBtn").addEventListener("click", _editBtnClickHandler);
    commentItem.querySelector(".js__delBtn").addEventListener("click", _delBtnClickHandler);
    commentItem.querySelector(".js__likeBtn").addEventListener("click", _likeBtnClickHandler);
    commentItem.querySelector(".js__unLikeBtn").addEventListener("click", _unLikeBtnClickHandler);
    commentItem.querySelector(".js__replyBtn").addEventListener("click", _replyBtnClickHandler);
  });
}

/*  */
function _replyBtnListenerMapping(e) {
  let btnList = document.querySelectorAll(".js__replyBtn");
  btnList.forEach(function(btn) {
    btn.addEventListener("click", _replyBtnClickHandler);
  });
}

/* 초기 실행되는 함수 (onload) */
function init() {
  /* 수정버튼 */
  const updateBtn = document.querySelector(".js__updatebtn");
  if (updateBtn) {
    updateBtn.addEventListener("click", _updateBtnClickHandler, false);
  }
  /* 하단부 댓글폼 입력버튼 */
  const commentSubmitBtn = document.querySelector(".js__commentSubmitBtn");
  commentSubmitBtn.addEventListener("click", _commentSubmitBtnClickHandler, false);

  /* TUi-editor 설정(뷰어로) */
  var editor = new tui.Editor({
    el: document.querySelector("#editSection"),
    initialValue: contents,
    viewOnly: true,
    height: "800px"
  });

  /* 댓글목록 불러오기 */
  _getCommentList()
    .then(_commentListDrawing)
    .catch(_errorHandler);
}

window.onload = init;
