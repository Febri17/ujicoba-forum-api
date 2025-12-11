/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addLike({ comment_id = 'comment-123', user_id = 'user-123' } = {}) {
    const query = {
      text: 'INSERT INTO comment_likes(comment_id, user_id) VALUES($1, $2)',
      values: [comment_id, user_id],
    };

    await pool.query(query);
  },

  async findLike(comment_id, user_id) {
    const query = {
      text: 'SELECT comment_id, user_id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [comment_id, user_id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getLikesByCommentId(comment_id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1',
      values: [comment_id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
