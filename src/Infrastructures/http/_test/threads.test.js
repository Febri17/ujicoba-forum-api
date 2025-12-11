/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('POST /threads', () => {
    it('should response 201 and added thread', async () => {
      // arrange: create user and login to obtain access token
      const requestPayloadUser = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual('sebuah thread');
    });

    it('should response 400 when payload invalid', async () => {
      const server = await createServer(container);

      const requestPayload = {
        title: 123, // invalid type
      };

      // need auth header but payload invalid should be dominantly 400 for payload
      // create user & login quickly
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('POST /threads/{threadId}/comments', () => {
    it('should response 201 and added comment', async () => {
      const server = await createServer(container);

      // create user and login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      // create thread
      const createThreadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'thread 1', body: 'body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { data: { addedThread } } = JSON.parse(createThreadRes.payload);

      // add comment
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'sebuah comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 if thread not found', async () => {
      const server = await createServer(container);

      // create user & login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-unknown/comments',
        payload: { content: 'sebuah comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 when owner deletes their comment', async () => {
      const server = await createServer(container);

      // make user, login, thread, comment
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      const createThreadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'thread 1', body: 'body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread } } = JSON.parse(createThreadRes.payload);

      const createCommentRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'sebuah comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment } } = JSON.parse(createCommentRes.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and added reply', async () => {
      const server = await createServer(container);

      // create user and login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      // create thread
      const createThreadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'thread 1', body: 'body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { data: { addedThread } } = JSON.parse(createThreadRes.payload);

      // create comment
      const createCommentRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'sebuah comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment } } = JSON.parse(createCommentRes.payload);

      // add reply
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: { content: 'sebuah reply' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when owner deletes their reply', async () => {
      const server = await createServer(container);

      // make user, login, thread, comment, reply
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      const createThreadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'thread 1', body: 'body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread } } = JSON.parse(createThreadRes.payload);

      const createCommentRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'sebuah comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment } } = JSON.parse(createCommentRes.payload);

      const createReplyRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: { content: 'sebuah reply' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedReply } } = JSON.parse(createReplyRes.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  // ---------- NEW TESTS FOR LIKES ----------
  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when liking and then 200 when unliking (toggle)', async () => {
      const server = await createServer(container);

      // create user & login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding' },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      // create thread
      const threadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'thread like', body: 'body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread } } = JSON.parse(threadRes.payload);

      // add comment
      const commentRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'comment 1' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment } } = JSON.parse(commentRes.payload);

      // like (first time)
      const likeRes1 = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const likeJson1 = JSON.parse(likeRes1.payload);
      expect(likeRes1.statusCode).toEqual(200);
      expect(likeJson1.status).toEqual('success');

      // like again => unlike (toggle)
      const likeRes2 = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const likeJson2 = JSON.parse(likeRes2.payload);
      expect(likeRes2.statusCode).toEqual(200);
      expect(likeJson2.status).toEqual('success');
    });
  });

  describe('GET /threads/{threadId} should include likeCount per comment', () => {
    it('should reflect likeCount change after liking', async () => {
      const server = await createServer(container);

      // create user & login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding' },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      // create thread
      const threadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'thread like 2', body: 'body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread } } = JSON.parse(threadRes.payload);

      // add comment
      const commentRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'comment 1' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment } } = JSON.parse(commentRes.payload);

      // before like: likeCount should be 0
      const threadBefore = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });
      const threadBeforeJson = JSON.parse(threadBefore.payload);
      expect(threadBefore.statusCode).toEqual(200);
      expect(threadBeforeJson.data.thread.comments[0].likeCount).toBeDefined();
      expect(threadBeforeJson.data.thread.comments[0].likeCount).toEqual(0);

      // like
      await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // after like: likeCount should be 1
      const threadAfter = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });
      const threadAfterJson = JSON.parse(threadAfter.payload);
      expect(threadAfter.statusCode).toEqual(200);
      expect(threadAfterJson.data.thread.comments[0].likeCount).toBeDefined();
      expect(threadAfterJson.data.thread.comments[0].likeCount).toEqual(1);

      // unlike (toggle)
      await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // after unlike: likeCount should be 0
      const threadFinal = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });
      const threadFinalJson = JSON.parse(threadFinal.payload);
      expect(threadFinal.statusCode).toEqual(200);
      expect(threadFinalJson.data.thread.comments[0].likeCount).toBeDefined();
      expect(threadFinalJson.data.thread.comments[0].likeCount).toEqual(0);
    });
  });

  // ---------- end NEW TESTS ----------

  describe('GET /threads/{threadId}', () => {
    it('should return thread detail with comments and replies (deleted comment replaced)', async () => {
      const server = await createServer(container);

      // create user, login, thread
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding' },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      const threadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'thread 1', body: 'body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread } } = JSON.parse(threadRes.payload);

      // add comment
      const commentRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'comment 1' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment } } = JSON.parse(commentRes.payload);

      // add reply to comment
      const replyRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: { content: 'reply 1' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedReply } } = JSON.parse(replyRes.payload);

      // soft delete comment
      await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
      // deleted comment must show special content
      expect(responseJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });
  });

  describe('GET /threads/{threadId}', () => {
    it('should return thread detail with comments and replies (deleted reply replaced)', async () => {
      const server = await createServer(container);

      // create user, login, thread
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding' },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginRes.payload);

      const threadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'thread 1', body: 'body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread } } = JSON.parse(threadRes.payload);

      // add comment
      const commentRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'comment 1' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment } } = JSON.parse(commentRes.payload);

      // add reply to comment
      const replyRes = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: { content: 'reply 1' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedReply } } = JSON.parse(replyRes.payload);

      // soft delete reply
      await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(Array.isArray(responseJson.data.thread.comments[0].replies)).toBe(true);
      // deleted reply must show special content
      expect(responseJson.data.thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    });
  });
});
