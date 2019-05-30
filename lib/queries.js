module.exports = {
  USER_INSERT:
    "INSERT INTO users(id, username, email, password, create_date, modify_date) VALUES(?,?,?,?,NOW(),NOW());",
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
  BOARD_INSERT:
    "INSERT INTO board(title, contents, category_id, user_id, del_flag, create_date, modify_date) VALUES(?,?,?,?,0,NOW(),NOW());",
  BOARD_SELECT_CATEGORY_ID_ONE_WHERE_ID: "SELECT category_id FROM board WHERE id = ?",
  BOARD_JOIN_USER_SELECT_ONE_WHERE_ID:
    "SELECT b.id AS 'board_id', b.title, b.contents, bc.id AS 'category_id', bc.description AS 'category', u.id AS 'user_id', u.username, b.create_date, b.view_count, b.del_flag FROM board AS b, board_category AS bc, users AS u WHERE b.user_id = u.id AND b.category_id = bc.id AND b.id = ?;",
  BOARD_JOIN_USER_JOIN_CATEGORY_ALL_WHERE_CATEGORY_ID_LIMIT_OFFSET:
    "SELECT b.id, b.title, u.username, b.create_date, b.view_count FROM board b, board_category bc, users u WHERE b.category_id = bc.id AND b.user_id = u.id AND bc.id = ? AND b.del_flag = 0 ORDER BY b.id DESC LIMIT ?,?;",
  BOARD_UPDATE_VIEW_COUNT_UP_WHERE_ID: "UPDATE board SET view_count = view_count + 1 WHERE id = ?;",
  BOARD_UPDATE_CONTETNS_WHERE_ID:
    "UPDATE board SET title = ?, contents = ?, category_id = ?, modify_date = NOW() WHERE id = ?;",
  BOARD_DELETE_ONE_WHERE_ID: "UPDATE board SET del_flag = 1, modify_date = NOW() WHERE id = ?;",
  BOARD_CATEGORY_SELECT_ALL: "SELECT * FROM board_category;",
  BOARD_CATEGORY_SELECT_ONE_WHERE_ID: "SELECT * FROM board_category WHERE id = ?;",
  BOARD_CATEGORY_COUNT_ALL_WHERE_CATEGORY_ID:
    "SELECT COUNT(*) AS 'totalCnt' FROM board WHERE category_id = ?;",
  FILE_INSERT:
    "INSERT INTO file_info(file_name, save_file_name, content_type, size) VALUES(?,?,?,?);",
  FILE_SELECT_ONE_WHERE_ID: "SELECT * FROM file_info WHERE id = ?;",
  FILE_UPDATE_ONE_WHERE_ID_COUNT_PLUS:
    "UPDATE file_info SET req_count = req_count + 1 WHERE id = ?;"
};
