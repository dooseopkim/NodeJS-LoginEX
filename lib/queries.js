module.exports = {
  USER_INSERT:
    "INSERT INTO users(id,username,email,password,create_date,modify_date) VALUES(?,?,?,?,NOW(),NOW());",
  USER_SELECT_ONE_WHERE_ID: "SELECT * FROM users WHERE id = ?;",
  USER_SELECT_ONE_WHERE_USERNAME: "SELECT * FROM users WHERE username = ?;",
  USER_SELECT_ONE_WHERE_EMAIL: "SELECT * FROM users WHERE email = ?;",
  USER_SELECT_ONE_WHERE_USERNAME_OR_EMAIL: "SELECT * FROM users WHERE username = ? OR email = ?;",
  USER_JOIN_SNS_INFO_SELECT_ONE_WHERE_SNSID:
    "SELECT * FROM users u, sns_info si WHERE u.id = si.id AND si.sns_id = ?;",
  USER_UPDATE_SNS_LINK_ACTIVATION_WHERE_ID:
    "UPDATE users SET sns_link = sns_link + 1 WHERE id = ?;",
  SNS_INFO_INSERT:
    "INSERT INTO sns_info(id, sns_id, sns_type, sns_name, sns_connect_date) VALUES(?,?,?,?,NOW());",
  BOARD_INSERT_TO_GET_BOARD_ID: "INSERT INTO board(title) VALUES('');",
  FILE_INSERT:
    "INSERT INTO file_info(file_name, save_file_name, content_type, size) VALUES(?,?,?,?);",
  FILE_SELECT_ONE_WHERE_ID: "SELECT * FROM file_info WHERE id = ?;",
  FILE_UPDATE_ONE_WHERE_ID_COUNT_PLUS:
    "UPDATE file_info SET req_count = req_count + 1 WHERE id = ?;"
};
