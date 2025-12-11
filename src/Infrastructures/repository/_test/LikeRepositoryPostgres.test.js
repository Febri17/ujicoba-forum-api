/* eslint-disable max-len */
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike & isLiked & getLikeCountByCommentId & deleteLike', () => {
    it('should persist like and reflect correct isLiked and likeCount', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action: initially isLiked false
      const initiallyLiked = await likeRepositoryPostgres.isLiked('comment-123', 'user-123');
      expect(initiallyLiked).toBe(false);

      // add like
      await likeRepositoryPostgres.addLike({ commentId: 'comment-123', owner: 'user-123' });

      // Assert: isLiked true & count 1
      const afterLiked = await likeRepositoryPostgres.isLiked('comment-123', 'user-123');
      expect(afterLiked).toBe(true);

      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');
      expect(likeCount).toBe(1);

      // add another user like to ensure count increments
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'otheruser' });
      await likeRepositoryPostgres.addLike({ commentId: 'comment-123', owner: 'user-124' });
      const likeCount2 = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');
      expect(likeCount2).toBe(2);

      // delete like by first user
      await likeRepositoryPostgres.deleteLike('comment-123', 'user-123');
      const likeCountAfterDelete = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');
      expect(likeCountAfterDelete).toBe(1);

      // final isLiked for deleted user should be false
      const finalIsLiked = await likeRepositoryPostgres.isLiked('comment-123', 'user-123');
      expect(finalIsLiked).toBe(false);
    });
  });
});
