module.exports = {
  USER_INSERT: `
      INSERT INTO users(id,username,email,password,create_date,modify_date) 
      VALUES(?,?,?,?,NOW(),NOW());
    `,
  USER_INSERT_WITH_GOOGLE: `
      INSERT INTO users(id,email,password,nickname,googleid)
      VALUES(?,?,?,?,?);
    `,
  USER_SELECT_ONE_FOR_ID: `
      SELECT *
      FROM users
      WHERE id = ?;
    `,
  USER_SELECT_ONE_FOR_LOGIN: `
      SELECT *
      FROM users
      WHERE email = ?;
    `,
  USER_UPDATE_EXISTS_USER_LOGIN_GOOGLE: `
      UPDATE users
      SET nickname = ?,
        googleid = ?
      WHERE id = ?;
    `,
  USER_UPDATE_EXISTS_USER_LOGIN_GITHUB: `
      UPDATE users
      SET nickname = ?,
        githubid = ?
      WHERE id = ?
    `,
  USER_SELECT_ONE_WHERE_USERNAME: `
      SELECT *
      FROM users
      WHERE username = ?;
    `,
  USEER_SELECT_ONE_WHERE_EMAIL: `
      SELECT *
      FROM users
      WHERE email = ?;
    `
};
