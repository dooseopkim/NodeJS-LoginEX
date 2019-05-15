$(function() {
  var isUserNameValid = false,
    isEmailValid = false,
    isPasswordValid = false,
    isPasswordConfirmValid = false;

  /* UserName Check */
  $("#userName").on("keyup", function() {
    var username = $(this).val();
    /* 값이 없을때 */
    if (username === "") {
      _userNameReset();
      return false;
    }
    /* 닉네임 형식 유효성 체크 */
    if (!_userNameValidate(username)) {
      $("#userNameAddOn")
        .attr("class", "input-group-text warning")
        .html('<i class="fas fa-info-circle"></i>');
      $("#userNameStatus")
        .attr("class", "text-warning")
        .text("올바르지 않은 형식");
      isUserNameValid = false;
      return false;
    }
    $.ajax({
      type: "POST",
      url: "/signin/validation/username/",
      datatype: "json",
      data: { username: username },
      success: function(result) {
        if (result.isExist) {
          $("#userNameAddOn")
            .attr("class", "input-group-text danger")
            .html('<i class="fas fa-times-circle"></i>');
          $("#userNameStatus")
            .attr("class", "text-danger")
            .text("이미 존재하는 닉네임");
          isUserNameValid = false;
        } else {
          $("#userNameAddOn")
            .attr("class", "input-group-text success")
            .html('<i class="fas fa-check-circle"></i>');
          $("#userNameStatus")
            .attr("class", "text-muted")
            .text("사용 가능한 닉네임");
          isUserNameValid = true;
        }
      }
    });
  });
  /* Email Check */
  $("#userEmail").on("keyup", function() {
    var email = $(this).val();
    /* 값이 없을때 */
    if (email === "") {
      _userEmailReset();
      return false;
    }
    if (!_emailValidate(email)) {
      $("#userEmailAddOn")
        .attr("class", "input-group-text warning")
        .html('<i class="fas fa-info-circle"></i>');
      $("#userEmailStatus")
        .attr("class", "text-warning")
        .text("올바르지 않은 이메일 형식");
      isEmailValid = false;
      return false;
    }
    $.ajax({
      type: "POST",
      url: "/signin/validation/email",
      datatype: "json",
      data: { email: email },
      success: function(result) {
        if (result.isExist) {
          $("#userEmailAddOn")
            .attr("class", "input-group-text danger")
            .html('<i class="fas fa-times-circle"></i>');
          $("#userEmailStatus")
            .attr("class", "text-danger")
            .text("이미 존재하는 이메일");
          isEmailValid = false;
        } else {
          $("#userEmailAddOn")
            .attr("class", "input-group-text success")
            .html('<i class="fas fa-check-circle"></i>');
          $("#userEmailStatus")
            .attr("class", "text-muted")
            .text("사용 가능한 이메일");
          isEmailValid = true;
        }
      }
    });
  });
  /* Password Check */
  $("#userPassword").on("keyup", function() {
    var userPassword = $(this).val();
    /* 값이 없을때 */
    if (userPassword === "") {
      _userPasswordReset();
      return false;
    }
    /* 비밀번호 확인이 끝난 상태에서 변경할 경우 */
    var password2 = $("#userPasswordConfirm").val();
    if (isPasswordConfirmValid) {
      if (userPassword !== password2) {
        $("#userPasswordConfirmAddOn")
          .attr("class", "input-group-text danger")
          .html('<i class="fas fa-times-circle"></i>');
        $("#userPasswordConfirmStatus")
          .attr("class", "text-danger")
          .html("비밀번호가 일치하지 않습니다.");
        isPasswordConfirmValid = false;
        return false;
      }
    } else {
      if (userPassword === password2) {
        $("#userPasswordConfirmAddOn")
          .attr("class", "input-group-text success")
          .html('<i class="fas fa-check-circle"></i>');
        $("#userPasswordConfirmStatus")
          .attr("class", "text-muted")
          .html("비밀번호가 일치합니다.");
        isPasswordConfirmValid = true;
        return false;
      }
    }
    if (_passwordValidate(userPassword)) {
      $("#userPasswordAddOn")
        .attr("class", "input-group-text success")
        .html('<i class="fas fa-check-circle"></i>');
      $("#userPasswordStatus")
        .attr("class", "text-muted")
        .html("사용 가능한 비밀번호");
      isPasswordValid = true;
    } else {
      $("#userPasswordAddOn")
        .attr("class", "input-group-text danger")
        .html('<i class="fas fa-times-circle"></i>');
      $("#userPasswordStatus")
        .attr("class", "text-danger")
        .html("올바르지 않은 비밀번호");
      isPasswordValid = false;
    }
  });
  /* Password Double Check */
  $("#userPasswordConfirm").on("keyup", function() {
    var password1 = $("#userPassword").val();
    var password2 = $(this).val();
    /* 값이 없을때 */
    if (password2 === "") {
      _userPasswordConfirmReset();
      return false;
    }
    if (password1 === password2) {
      if (!isPasswordValid) {
        $("#userPasswordConfirmAddOn")
          .attr("class", "input-group-text danger")
          .html('<i class="fas fa-times-circle"></i>');
        $("#userPasswordConfirmStatus")
          .attr("class", "text-danger")
          .html("올바르지 않은 비밀번호");
        isPasswordConfirmValid = false;
        return false;
      }
      $("#userPasswordConfirmAddOn")
        .attr("class", "input-group-text success")
        .html('<i class="fas fa-check-circle"></i>');
      $("#userPasswordConfirmStatus")
        .attr("class", "text-muted")
        .html("비밀번호가 일치합니다.");
      isPasswordConfirmValid = true;
    } else {
      $("#userPasswordConfirmAddOn")
        .attr("class", "input-group-text danger")
        .html('<i class="fas fa-times-circle"></i>');
      $("#userPasswordConfirmStatus")
        .attr("class", "text-danger")
        .html("비밀번호가 일치하지 않습니다.");
      isPasswordConfirmValid = false;
    }
  });
  /* 회원가입 button click */
  $(".js__signinbtn").click(function() {
    if (!isUserNameValid && !isEmailValid && !isPasswordValid && !isPasswordConfirmValid) {
      alert("값을 입력해주세요");
      $("#userName").focus();
      return false;
    }
    if (!isUserNameValid) {
      alert("닉네임 값을 확인해주세요");
      $("#userName").focus();
      return false;
    }
    if (!isEmailValid) {
      alert("이메일 주소를 확인해주세요");
      $("#userEmail").focus();
      return false;
    }
    if (!isPasswordValid) {
      alert("비밀번호를 확인해주세요");
      $("#userPassword").focus();
      return false;
    }
    if (!isPasswordConfirmValid) {
      alert("비밀번호를 확인해주세요");
      $("#userPasswordConfirm").focus();
      return false;
    }
    $(".js__signinfrm").submit();
  });
  /* 초기화 button click */
  $(".js__resetbtn").click(function() {
    if (confirm("모든 값을 초기화 하시겠습니까?")) {
      $(".js__signinfrm")[0].reset();
      _userNameReset();
      _inputGroupReset("userEmail", "이메일 주소를 입력해주세요");
      // _userEmailReset();
      _userPasswordReset();
      _userPasswordConfirmReset();
      $("#userName").focus();
    }
  });
  /* 취소 button click */
  $(".js__cancelbtn").click(function() {
    if (confirm("입력한 값들이 사라집니다. 취소하시겠습니까?")) {
      history.back();
    }
  });
  /* 
    UserName Validation Check with Regex 
    ( 한글 + 영문 + 숫자 + _ ) 4자 이상 20자 이하  
  */
  var _userNameValidate = function(userName) {
    var re = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\w\d]{4,20}$/;
    return re.test(userName);
  };

  /* Email Validation Check with Regex */
  var _emailValidate = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  /* 
    Password Validation Check with Regex
    (영문소문자 1개 이상 && 영문대문자 1개 이상 && 숫자 1개 이상) 8자 이상 20자 이하
  */
  var _passwordValidate = function(password) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/;
    return re.test(password);
  };
  /* 초기화 */
  var _userNameReset = function() {
    $("#userNameAddOn")
      .removeClass()
      .html("");
    $("#userNameStatus")
      .attr("class", "text-muted")
      .text("닉네임을 입력해주세요 (한글 또는 영문 4-20자, _ 외 특수문자 불가)");
    isUserNameValid = false;
  };
  var _userEmailReset = function() {
    $("#userEmailAddOn")
      .removeClass()
      .html("");
    $("#userEmailStatus")
      .attr("class", "text-muted")
      .text("이메일 주소를 입력해주세요");
    isEmailValid = false;
  };
  var _userPasswordReset = function() {
    $("#userPasswordAddOn")
      .removeClass()
      .html("");
    $("#userPasswordStatus")
      .attr("class", "text-muted")
      .text("비밀번호를 입력해주세요 (영문 소문자, 대문자 숫자 1개 이상 필수)");
    isPasswordValid = false;
  };
  var _userPasswordConfirmReset = function() {
    $("#userPasswordConfirmAddOn")
      .removeClass()
      .html("");
    $("#userPasswordConfirmStatus")
      .attr("class", "text-muted")
      .text("비밀번호를 한 번 더 입력해주세요");
    isPasswordConfirmValid = false;
  };
  //////////////////////////////////////////////////////////////////////////////////////
  var _inputGroupReset = function(group, msg) {
    var addOn = `#${group}AddOn`;
    var status = `#${group}Status`;

    $(addOn)
      .removeClass()
      .html("");
    $(status)
      .attr("class", "text-muted")
      .text(msg);
    _flagReset(group);
  };
  var _flagReset = function(group) {
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
});
