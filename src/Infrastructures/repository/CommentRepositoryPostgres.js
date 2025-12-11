const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, FALSE) RETURNING id, content, owner',
      values: [id, content, threadId, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    const commentOwner = result.rows[0].owner;
    if (commentOwner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  // helper for GetThreadUseCase
  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_delete
             FROM comments c
             LEFT JOIN users u ON u.id = c.owner
             WHERE c.thread_id = $1
             ORDER BY c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((r) => ({
      id: r.id,
      username: r.username,
      date: r.date,
      content: r.content,
      is_delete: r.is_delete,
    }));
  }
}

module.exports = CommentRepositoryPostgres;
