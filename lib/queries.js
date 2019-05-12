module.exports = {
  TOPIC_JOIN_AUTHOR_SELECT_ALL: `
      SELECT t.id AS id, title, description, created, a.id AS author_id, name, profile
      FROM topic t LEFT JOIN author a on t.author_id = a.id
      ORDER by t.id DESC LIMIT 15;
      `,
  TOPIC_JOIN_AUTHOR_SELECT_ONE: `
      SELECT t.id AS id, title, description, created, a.id AS author_id, name, profile
      FROM topic t LEFT JOIN author a on t.author_id = a.id
      WHERE t.id = ?;
      `,
  TOPIC_INSERT: `
      INSERT INTO topic(title, description, created, author_id)
      VALUES(?,?,NOW(),?);
      `,
  TOPIC_UPDATE: `
      UPDATE topic 
      SET title = ?, 
        description = ?, 
        author_id = ? 
      WHERE id = ?;
      `,
  TOPIC_DELETE: `
      DELETE FROM topic 
      WHERE id = ?;
      `,
  AUTHOR_SELECT: `
      SELECT * 
      FROM author;
      `,
  USER_INSERT: `
      INSERT INTO users 
      VALUES(?,?,?,?);
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
    `
};
