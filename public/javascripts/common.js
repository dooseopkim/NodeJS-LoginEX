var passwordChkCallBack = function(e) {
  var signInFrm = e.target.parentNode;
  var password1 = signInFrm.querySelector("#userPassword");
  var password2 = e.target;
  var passwordCheckText = signInFrm.querySelector("#passwordCheckText");
  if (password1.value === password2.value) {
    passwordCheckText.classList.remove("alert-primary", "alert-danger");
    passwordCheckText.classList.add("alert-success");
    passwordCheckText.innerText = "비밀번호 확인 완료";
  } else {
    passwordCheckText.classList.remove("alert-primary", "alert-success");
    passwordCheckText.classList.add("alert-danger");
    passwordCheckText.innerText = "비밀번호 확인 실패";
  }
};

var init = function() {
  var passwordcheck = document.querySelector("#userPasswordCheck");
  if (passwordcheck) {
    passwordcheck.addEventListener("focus", passwordChkCallBack);
    passwordcheck.addEventListener("blur", passwordChkCallBack);
    passwordcheck.addEventListener("input", passwordChkCallBack);
  }
  console.log("hello", passwordcheck);
};
init();
