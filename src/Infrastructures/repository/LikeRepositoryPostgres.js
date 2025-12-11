const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addLike(newLike) {
    // newLike is instance of NewLike
    const { commentId, owner } = newLike;
    const query = {
      text: 'INSERT INTO comment_likes(comment_id, user_id) VALUES($1, $2)',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async isLiked(commentId, owner) {
    const query = {
      text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*) AS count FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    // return number
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = LikeRepositoryPostgres;
