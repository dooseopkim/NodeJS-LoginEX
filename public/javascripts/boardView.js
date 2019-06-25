/* 상수값 */
const BEFORE_BEGIN = "beforebegin";
const BEFORE_END = "beforeend";
const AFTER_END = "afterend";

const BASE_COMMENTS_URL = "/comments";

const GET_METHOD = "GET";
const POST_METHOD = "POST";
const PUT_METHOD = "PUT";
const DELETE_METHOD = "DELETE";

const SERVER_FAIL_MESSAGE = "Connect to server failed";
/* 대댓글 입력, 댓글 수정 폼 */
const _replyFormTemplate = function(status) {
  // status = 'reply' 대댓글 입력 폼
  // status = 'update' 댓글 수정 폼
  let formStyle, commentLabel, commentSubmitBtn, commentSubmitBtnText;
  if (status === "reply") {
    formStyle = "c-reply-form";
    commentLabel = "답글쓰기";
    commentSubmitBtn = "js__commentAddBtn";
    commentSubmitBtnText = "제출";
  } else {
    formStyle = "c-update-form";
    commentLabel = "댓글수정";
    commentSubmitBtn = "js__commentUpdateSubmitBtn";
    commentSubmitBtnText = "수정";
  }
  return `
  <form class="form-box mt-4 ${formStyle}">
    <div class="form-group mt-4">
      <label for="comments">${commentLabel}</label> 
      <textarea name="comments" cols="40" rows="5" class="form-control js__commentsText"></textarea>
    </div> 
    <div class="form-group text-right">
      <button name="submit" type="button" class="btn btn-primary px-4 ${commentSubmitBtn}">${commentSubmitBtnText}</button>
      <button type="button" class="btn btn-danger px-4">취소</button>
    </div>
  </form>
  `;
};

/* 댓글(comment-item) - 댓글, 대댓글 입력후 화면에 보여주는 템플릿 */
const _replyTemplate = function(commentObj) {
  return `
  <div class="comment-item ${commentObj.depth}" id="c-${commentObj.id}">
    <div class="comment-header d-flex justify-content-between align-items-center">
      <div class="left">
        <h5 class="h5 mb-0 comment-title">${commentObj.username}</h5>
        <span class="comment-date">${commentObj.modifyDate}</span>
      </div>
      <div class="right">
        <button class="d-inline-block comment-update js__commentUpdateBtn"><i class="fas fa-cog"></i></button>
        <button class="d-inline-block comment-del js__commentDeleteBtn"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="comment-body is-visible"><pre class="comment-text">${
      commentObj.contents
    }</pre></div>
    <div class="comment-footer is-visible">
      <ul class="list-inline d-sm-flex my-0">
        <li class="list-inline-item">
          <button class="comment-like js__commentLikeBtn"><i class="fa fa-thumbs-up"></i></button
          ><span>${commentObj.like}</span>
        </li>
        <li class="list-inline-item">
          <button class="comment-unLike js__commentUnLikeBtn">
            <i class="fa fa-thumbs-down g-pos-rel g-top-1 g-mr-3"></i></button
          ><span>${commentObj.unlike}</span>
        </li>
        <li class="list-inline-item ml-auto">
          <button class="comment-reply js__commentReplyBtn">
            <i class="fa fa-reply g-pos-rel g-top-1 g-mr-3"></i> Reply
          </button>
        </li>
      </ul>
    </div>
  </div>
  `;
};

/* 에러 */
const _errorHandler = function(error) {
  console.error(error);
};

/* 공통함수 */
// 댓글 수정, 삭제 이전 본인 댓글 여부 확인
const _isMyComment = function(commentId) {
  const url = `${BASE_COMMENTS_URL}/${commentId}`;
  const xhr = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return false;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(SERVER_FAIL_MESSAGE);
      }
    };
    xhr.open(GET_METHOD, url, true);
    xhr.responseType = "json";
    xhr.send();
  });
};
// 댓글 삭제요청
const _commentDeleteProc = function(commentId) {
  const url = `${BASE_COMMENTS_URL}/${commentId}`;
  const xhr = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return false;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(SERVER_FAIL_MESSAGE);
      }
    };
    xhr.open(DELETE_METHOD, url, true);
    xhr.responseType = "json";
    xhr.send();
  });
};
// 댓글, 대댓글, 수정할 댓글 서버로 전송(DB 저장 후 해당 댓글 정보 반환)
const _commentSubmitProc = function(addParams, reqMethod) {
  const xhr = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return false;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(SERVER_FAIL_MESSAGE);
      }
    };
    xhr.open(reqMethod, BASE_COMMENTS_URL, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(addParams));
  });
};
// display hide, show 함수
const _hide = function(el) {
  if (el.classList.contains("is-visible")) {
    el.classList.remove("is-visible");
    el.classList.add("is-hide");
  }
};
const _show = function(el) {
  if (el.classList.contains("is-hide")) {
    el.classList.remove("is-hide");
    el.classList.add("is-visible");
  }
};
/* 취소 */
// js__cancelBtn
const _cancelBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
};

/* 게시글 수정 */
// js__boardUpdateBtn
const _boardUpdateBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
};

/* 댓글 입력 */
// js__commentAddBtn
const _commentAddBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
  let commentItem = target.parentElement.parentElement.parentElement;
  const boardId = document.querySelector("#boardId").value;
  const commentsTextArea = commentItem.querySelector(".js__commentsText");
  let addParams,
    newCommentItemLoc,
    reqMethod = POST_METHOD;
  if (commentItem.classList.contains("comment-form")) {
    // 기본 댓글
    addParams = {
      status: "comment",
      boardId: boardId,
      commentsText: commentsTextArea.value,
      parentId: ""
    };
    newCommentItemLoc = BEFORE_BEGIN;
    commentsTextArea.value = ""; // 값 초기화
  } else {
    // 대댓글
    addParams = {
      status: "reply",
      boardId: boardId,
      commentsText: commentsTextArea.value,
      parentId: commentItem.id.split("-")[1]
    };
    newCommentItemLoc = AFTER_END;
    commentItem.classList.remove("activeReply");
    commentItem.querySelector(".c-reply-form").remove(); // 대댓글 입력 폼 제거
  }
  console.log("----> IN", addParams);
  _commentSubmitProc(addParams, reqMethod)
    .then(function(resCommentObj) {
      console.log("<---- OUT", resCommentObj);
      commentItem.insertAdjacentHTML(newCommentItemLoc, _replyTemplate(resCommentObj));
      let newCommentItem = document.querySelector(`#c-${resCommentObj.id}`);
      _commentItemsButtonComponentsHandlerMapping(newCommentItem);
    })
    .catch(_errorHandler);
};

/* 댓글 수정 */
// js__commentUpdateBtn
const _commentUpdateBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
  let commentItem = target.parentElement.parentElement.parentElement;
  let commentId = commentItem.id.split("-")[1];
  _isMyComment(commentId)
    .then(function(isMyComment) {
      if (isMyComment) {
        // alert("수정할 수 있다");

        let commentBody = commentItem.querySelector(".comment-body");
        let commentFooter = commentItem.querySelector(".comment-footer");
        let commentTextValue = commentItem.querySelector(".comment-text");
        let newCommentForm = _replyFormTemplate("update");

        if (commentItem.classList.contains("activeUpdate")) {
          commentItem.classList.remove("activeUpdate");
          commentItem.querySelector(".c-update-form").remove();

          _show(commentBody);
          _show(commentFooter);
        } else {
          commentItem.classList.add("activeUpdate");
          _hide(commentBody);
          _hide(commentFooter);

          commentItem.insertAdjacentHTML(BEFORE_END, newCommentForm);
          commentItem.querySelector(".js__commentsText").value = commentTextValue.innerHTML;
          commentItem.querySelector(
            ".js__commentUpdateSubmitBtn"
          ).onclick = _commentUpdateSubmitBtnClickHandler;
        }

        return false;
      } else {
        alert("본인이 작성한 글만 수정 가능");
        return false;
      }
    })
    .catch(_errorHandler);
};
/* 댓글 수정 submit */
// js__commentUpdateSubmitBtn
const _commentUpdateSubmitBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
  let commentItem = target.parentElement.parentElement.parentElement;
  let commentBody = commentItem.querySelector(".comment-body");
  let commentFooter = commentItem.querySelector(".comment-footer");
  let commentId = commentItem.id.split("-")[1];
  let newCommentTextValue = commentItem.querySelector(".js__commentsText").value;
  let addParams,
    reqMethod = PUT_METHOD;

  addParams = {
    commentId: commentId,
    commentText: newCommentTextValue
  };

  _commentSubmitProc(addParams, reqMethod)
    .then(function(resParams) {
      if (resParams.isUpdated) {
        commentItem.classList.remove("activeUpdate");
        commentItem.querySelector(".c-update-form").remove();

        commentBody.querySelector("pre").innerHTML = resParams.newComments;
        _show(commentBody);
        _show(commentFooter);
        // console.log(resParams.newComments);
        // console.log(resParams.modifyDate);
      } else {
        console.log("망해떠");
      }
    })
    .catch(_errorHandler);
};
/* 댓글 삭제 */
// js__commentDeleteBtn
const _commentDeleteBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
  let commentItem = target.parentElement.parentElement.parentElement;
  let commentId = commentItem.id.split("-")[1];
  _isMyComment(commentId)
    .then(function(isMyComment) {
      if (isMyComment) {
        if (confirm("삭제하시겠습니까?")) {
          _commentDeleteProc(commentId)
            .then(function(isDeleted) {
              if (isDeleted) {
                commentItem.remove();
              } else {
                alert("삭제 작업 실패");
              }
            })
            .catch(_errorHandler);
        }
      } else {
        alert("본인이 작성한 글만 삭제 가능");
        return false;
      }
    })
    .catch(_errorHandler);
};

/* 댓글 좋아요 */
// js__commentLikeBtn
const _commentLikeBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
};

/* 댓글 싫어요 */
// js__commentUnLikeBtn
const _commentUnLikeBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
};

/* 대댓글 폼 활성화(Reply버튼 클릭) */
// js__commentReplyBtn
const _commentReplyBtnClickHandler = function(e) {
  e.preventDefault();
  const target = e.currentTarget;
  console.log(target);
  let commentItem = target.parentElement.parentElement.parentElement.parentElement;
  if (commentItem.classList.contains("activeReply")) {
    commentItem.classList.remove("activeReply");
    commentItem.querySelector(".c-reply-form").remove();
  } else {
    commentItem.classList.add("activeReply");
    let commentReplyForm = _replyFormTemplate("reply");
    commentItem.insertAdjacentHTML(BEFORE_END, commentReplyForm);
    commentItem.querySelector(".js__commentAddBtn").onclick = _commentAddBtnClickHandler;
  }
};

/* 댓글관련 함수 매핑 */
const _commentItemsButtonComponentsHandlerMapping = function(commentItem) {
  // 모든 버튼 찾기
  let commentUpdateBtn = commentItem.querySelector(".js__commentUpdateBtn");
  let commentDeleteBtn = commentItem.querySelector(".js__commentDeleteBtn");
  let commentLikeBtn = commentItem.querySelector(".js__commentLikeBtn");
  let commentUnLikeBtn = commentItem.querySelector(".js__commentUnLikeBtn");
  let commentReplyBtn = commentItem.querySelector(".js__commentReplyBtn");
  if (commentUpdateBtn) commentUpdateBtn.onclick = _commentUpdateBtnClickHandler;
  if (commentDeleteBtn) commentDeleteBtn.onclick = _commentDeleteBtnClickHandler;
  if (commentLikeBtn) commentLikeBtn.onclick = _commentLikeBtnClickHandler;
  if (commentUnLikeBtn) commentUnLikeBtn.onclick = _commentUnLikeBtnClickHandler;
  if (commentReplyBtn) commentReplyBtn.onclick = _commentReplyBtnClickHandler;
};

/* 초기화 */
const _init = function() {
  // TUi-editor 설정(뷰어로)
  var editor = new tui.Editor({
    el: document.querySelector("#editSection"),
    initialValue: contents,
    viewOnly: true,
    height: "800px"
  });

  // 게시글 수정 함수 매핑
  const boardUpdateBtn = document.querySelector(".js__boardUpdateBtn");
  if (boardUpdateBtn) boardUpdateBtn.onclick = _boardUpdateBtnClickHandler;

  // 기본 댓글 입력 폼 함수 매핑
  const commentAddBtn = document.querySelector(".js__commentAddBtn");
  if (commentAddBtn) commentAddBtn.onclick = _commentAddBtnClickHandler;

  // 모든 댓글(comment-item) 이벤트 함수 매핑
  const commentList = document.querySelectorAll(".comment-item");
  commentList.forEach(function(commentItem) {
    _commentItemsButtonComponentsHandlerMapping(commentItem);
  });
};

window.onload = _init;
