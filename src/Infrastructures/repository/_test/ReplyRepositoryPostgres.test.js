/* eslint-disable max-len */
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('Should persist added reply and return the added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });

      const newReply = new NewReply({
        content: 'febrian',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });

      const newReply = new NewReply({
        content: 'febrian',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'febrian',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        comment_id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-1234')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        comment_id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply not accessed by owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        comment_id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-1234')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when reply accessed by owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        comment_id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should set is_delete to TRUE when called', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        comment_id: 'comment-123',
        thread_id: 'thread-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123');

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toBe(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return reply details (raw data plus is_delete flag)', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'febrian' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });

      const fixedDate = new Date('2025-11-01T11:00:00.000Z');
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'a reply',
        comment_id: 'comment-123',
        owner: 'user-123',
        date: fixedDate,
        is_delete: false,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert: jumlah dan seluruh objek (termasuk is_delete and unmasked content)
      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({
        id: 'reply-123',
        username: 'febrian',
        date: fixedDate,
        content: 'a reply',
        is_delete: false,
      });
    });

    it('should return deleted reply as raw data with is_delete true (no masking in repo)', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'febrian' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });

      const fixedDate = new Date('2025-11-01T11:00:00.000Z');
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'a reply',
        comment_id: 'comment-123',
        owner: 'user-123',
        date: fixedDate,
        is_delete: true,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert: seluruh objek di-assert dan content harus masih mentah (repo tidak melakukan masking)
      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({
        id: 'reply-123',
        username: 'febrian',
        date: fixedDate,
        content: 'a reply',
        is_delete: true,
      });
    });
  });
});
