$(function() {
  var isUserNameValid = false,
    isEmailValid = false,
    isPasswordValid = false;
  /* UserName Check */
  $("#userName").on("keyup", function() {
    var username = $(this).val();
    $.ajax({
      type: "POST",
      url: "/signin/validation/username/",
      datatype: "json",
      data: { username: username },
      success: function(result) {
        if (result.isExist) {
          $("#userNameAddOn")
            .addClass("input-group-text")
            .removeClass("success")
            .addClass("danger")
            .html('<i class="fas fa-exclamation-circle"></i>');
          $("#userNameStatus")
            .removeClass("text-muted")
            .addClass("text-danger")
            .text("Already Exists Username");
          isUserNameValid = false;
        } else {
          $("#userNameAddOn")
            .addClass("input-group-text")
            .removeClass("danger")
            .addClass("success")
            .html('<i class="fas fa-check-circle"></i>');
          $("#userNameStatus")
            .removeClass("text-danger")
            .addClass("text-muted")
            .text("Available Username");
          isUserNameValid = true;
        }
      }
    });
  });
  /* Email Check */
  $("#userEmail").on("keyup", function() {
    var email = $(this).val();
    $.ajax({
      type: "POST",
      url: "/signin/validation/email",
      datatype: "json",
      data: { email: email },
      success: function(result) {
        if (result.isExist) {
          $("#userEmailAddOn")
            .addClass("input-group-text")
            .removeClass("success")
            .addClass("danger")
            .html('<i class="fas fa-exclamation-circle"></i>');
          $("#userEmailStatus")
            .removeClass("text-muted")
            .addClass("text-danger")
            .text("Already Exists Email");
          isEmailValid = false;
        } else {
          $("#userEmailAddOn")
            .addClass("input-group-text")
            .removeClass("danger")
            .addClass("success")
            .html('<i class="fas fa-check-circle"></i>');
          $("#userEmailStatus")
            .removeClass("text-danger")
            .addClass("text-muted")
            .text("Available Email");
          isEmailValid = true;
        }
      }
    });
  });
  /* Password Double Check */
  /* Password Validation Check */
  /* Submit Button Click Event */
  $(".js__signinbtn").hover(function() {
    if (isUserNameValid && isEmailValid) {
      $(".js__signinbtn").removeAttr("disabled");
    } else {
      $(".js__signinbtn").attr("disabled", "disabled");
    }
  });
});
