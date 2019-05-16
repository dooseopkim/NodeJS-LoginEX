$(function() {
  /**
   * =========================================================================
   *  Variables & Constant
   * =========================================================================
   */

  /* Flag */
  var isUserNameValid = false,
    isEmailValid = false,
    isPasswordValid = false,
    isPasswordConfirmValid = false;

  /* Elements */
  var form = $(".js__signinfrm");
  var userName = form.find("#userName"),
    userEmail = form.find("#userEmail"),
    userPassword = form.find("#userPassword"),
    userPasswordConfirm = form.find("#userPasswordConfirm");

  var submitBtn = form.find(".js__signinbtn"),
    resetBtn = form.find(".js__resetbtn"),
    cancelBtn = form.find(".js__cancelbtn");

  /* Constant */
  var USERNAME_CHECK_URL = "/signin/validation/username",
    EMAIL_CHECK_URL = "/signin/validation/email",
    SIGNIN_FORM_ACTION_URL = "/user/signin";

  var SUCCESS_ICON = `<i class="fas fa-check-circle"></i>`,
    WARNING_ICON = `<i class="fas fa-info-circle"></i>`,
    DANGER_ICON = `<i class="fas fa-times-circle"></i>`;

  var SUCCESS = "success",
    WARNING = "warning",
    DANGER = "danger",
    MUTED = "muted";

  var USERNAME_CONF = {
    group: "userName",
    mutedMsg: "닉네임을 입력해주세요 (한글 또는 영문 4-20자, _ 외 특수문자 불가)",
    warningMsg: "올바르지 않은 닉네임 형식",
    dangerMsg: "이미 존재하는 닉네임",
    successMsg: "사용 가능한 닉네임"
  };
  var EMAIL_CONF = {
    group: "userEmail",
    mutedMsg: "이메일 주소를 입력해주세요",
    warningMsg: "올바르지 않은 이메일 형식",
    dangerMsg: "이미 존재하는 이메일",
    successMsg: "사용 가능한 이메일"
  };
  var PASSWORD_CONF = {
    group: "userPassword",
    mutedMsg: "비밀번호를 입력해주세요 (영문 소문자, 대문자 숫자 1개 이상 필수)",
    warningMsg: "",
    dangerMsg: "올바르지 않은 비밀번호 형식",
    successMsg: "사용 가능한 비밀번호"
  };
  var PASSWORDCONFIRM_CONF = {
    group: "userPasswordConfirm",
    mutedMsg: "비밀번호를 한 번 더 입력해주세요",
    warningMsg: "올바르지 않은 비밀번호 형식",
    dangerMsg: "비밀번호가 일치하지 않습니다.",
    successMsg: "비밀번호가 일치합니다."
  };

  /**
   * =========================================================================
   *  Functions
   * =========================================================================
   */

  /* Validation functions using regex*/
  var _userNameValidate = function(userName) {
    var re = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\w\d]{4,20}$/;
    return re.test(userName);
  };

  var _emailValidate = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  var _passwordValidate = function(password) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/;
    return re.test(password);
  };

  /* Common functions */
  var _InputGroupHTML = function(groupObj, condition) {
    var group = groupObj.group;
    var addOn = `#${group}AddOn`;
    var status = `#${group}Status`;

    var addOnClass = `input-group-text ${condition}`;
    var icon = "";
    var statusClass = `text-${condition}`;
    var msg = "";

    switch (condition) {
      case "success":
        icon = SUCCESS_ICON;
        msg = groupObj.successMsg;
        _flagTrue(group);
        break;
      case "warning":
        icon = WARNING_ICON;
        msg = groupObj.warningMsg;
        _flagFalse(group);
        break;
      case "danger":
        icon = DANGER_ICON;
        msg = groupObj.dangerMsg;
        _flagFalse(group);
        break;
      case "muted":
        addOnClass = "";
        icon = "";
        msg = groupObj.mutedMsg;
        _flagFalse(group);
        break;
      default:
        break;
    }

    form
      .find(addOn)
      .attr("class", addOnClass)
      .html(icon);
    form
      .find(status)
      .attr("class", statusClass)
      .text(msg);
  };

  var _flagFalse = function(group) {
    switch (group) {
      case "userName":
        isUserNameValid = false;
        break;
      case "userEmail":
        isEmailValid = false;
        break;
      case "userPassword":
        isPasswordValid = false;
        break;
      case "userPasswordConfirm":
        isPasswordConfirmValid = false;
        break;
    }
  };
  var _flagTrue = function(group) {
    switch (group) {
      case "userName":
        isUserNameValid = true;
        break;
      case "userEmail":
        isEmailValid = true;
        break;
      case "userPassword":
        isPasswordValid = true;
        break;
      case "userPasswordConfirm":
        isPasswordConfirmValid = true;
        break;
    }
  };

  /* Button click event handler */
  var _submitBtnClickHandler = function() {
    if (!isUserNameValid && !isEmailValid && !isPasswordValid && !isPasswordConfirmValid) {
      alert("값을 입력해주세요");
      userName.focus();
      return false;
    }
    if (!isUserNameValid) {
      alert("닉네임 값을 확인해주세요");
      userName.focus();
      return false;
    }
    if (!isEmailValid) {
      alert("이메일 주소를 확인해주세요");
      userEmail.focus();
      return false;
    }
    if (!isPasswordValid) {
      alert("비밀번호를 확인해주세요");
      userPassword.focus();
      return false;
    }
    if (!isPasswordConfirmValid) {
      alert("비밀번호를 확인해주세요");
      userPasswordConfirm.focus();
      return false;
    }

    form
      .attr("action", SIGNIN_FORM_ACTION_URL)
      .attr("method", "post")
      .submit();
    return false;
  };

  var _resetBtnClickHandler = function() {
    if (confirm("모든 값을 초기화 하시겠습니까?")) {
      form[0].reset();
      var inputList = [USERNAME_CONF, EMAIL_CONF, PASSWORD_CONF, PASSWORDCONFIRM_CONF];
      inputList.forEach(function(input) {
        _InputGroupHTML(input, MUTED);
      });
      userName.focus();
      return false;
    }
  };

  var _cancelBtnClickHandler = function() {
    if (confirm("입력한 값들이 사라집니다. 취소하시겠습니까?")) {
      history.back();
      return false;
    }
  };

  /* Input tag keyup event handler (for validation)*/
  var _userNameInputKeyUpHandler = function() {
    var userNameVal = $(this).val();

    /* 값이 없을때 */
    if (userNameVal === "") {
      _InputGroupHTML(USERNAME_CONF, MUTED);
      return false;
    }
    /* 정규식 */
    if (!_userNameValidate(userNameVal)) {
      _InputGroupHTML(USERNAME_CONF, WARNING);
      return false;
    }
    $.ajax({
      type: "POST",
      url: USERNAME_CHECK_URL,
      datatype: "json",
      data: { username: userNameVal },
      success: function(result) {
        if (result.isExist) {
          _InputGroupHTML(USERNAME_CONF, DANGER);
          return false;
        } else {
          _InputGroupHTML(USERNAME_CONF, SUCCESS);
          return false;
        }
      }
    });
  };

  var _userEmailInputKeyUpHandler = function() {
    var emailVal = $(this).val();

    /* 값이 없을때 */
    if (emailVal === "") {
      _InputGroupHTML(EMAIL_CONF, MUTED);
      return false;
    }
    /* 정규식 */
    if (!_emailValidate(emailVal)) {
      _InputGroupHTML(EMAIL_CONF, WARNING);
      return false;
    }
    $.ajax({
      type: "POST",
      url: EMAIL_CHECK_URL,
      datatype: "json",
      data: { email: emailVal },
      success: function(result) {
        if (result.isExist) {
          _InputGroupHTML(EMAIL_CONF, DANGER);
          return false;
        } else {
          _InputGroupHTML(EMAIL_CONF, SUCCESS);
          return false;
        }
      }
    });
  };

  var _userPasswordInputKeyUpHandler = function() {
    var userPasswordVal = $(this).val();
    var userPasswordConfirmVal = userPasswordConfirm.val();

    /* 값이 없을때 */
    if (userPasswordVal === "") {
      _InputGroupHTML(PASSWORD_CONF, MUTED);
      return false;
    }
    /* 비밀번호 확인이 끝난 상태에서 변경할 경우 */
    if (isPasswordConfirmValid) {
      if (userPasswordVal !== userPasswordConfirmVal) {
        _InputGroupHTML(PASSWORDCONFIRM_CONF, DANGER);
        return false;
      }
    } else {
      if (userPasswordVal === userPasswordConfirmVal) {
        _InputGroupHTML(PASSWORDCONFIRM_CONF, SUCCESS);
        return false;
      }
    }
    /* 정규식 */
    if (_passwordValidate(userPasswordVal)) {
      _InputGroupHTML(PASSWORD_CONF, SUCCESS);
      return false;
    } else {
      _InputGroupHTML(PASSWORD_CONF, DANGER);
      return false;
    }
  };

  var _userPasswordConfirmInputKeyUpHandler = function() {
    var userPasswordVal = userPassword.val();
    var userPasswordConfirmVal = $(this).val();

    /* 값이 없을때 */
    if (userPasswordConfirmVal === "") {
      _InputGroupHTML(PASSWORDCONFIRM_CONF, MUTED);
      return false;
    }
    if (userPasswordVal === userPasswordConfirmVal) {
      if (!isPasswordValid) {
        _InputGroupHTML(PASSWORDCONFIRM_CONF, WARNING);
        return false;
      }
      _InputGroupHTML(PASSWORDCONFIRM_CONF, SUCCESS);
      return false;
    } else {
      _InputGroupHTML(PASSWORDCONFIRM_CONF, DANGER);
      return false;
    }
  };

  /**
   * =========================================================================
   *  Apply
   * =========================================================================
   */

  /* Apply callback function to button's click event */
  submitBtn.on("click", _submitBtnClickHandler);
  resetBtn.on("click", _resetBtnClickHandler);
  cancelBtn.on("click", _cancelBtnClickHandler);

  /* Apply callback functions to input's keyup event */

  userName.on("keyup", _userNameInputKeyUpHandler);
  userEmail.on("keyup", _userEmailInputKeyUpHandler);
  userPassword.on("keyup", _userPasswordInputKeyUpHandler);
  userPasswordConfirm.on("keyup", _userPasswordConfirmInputKeyUpHandler);
});
