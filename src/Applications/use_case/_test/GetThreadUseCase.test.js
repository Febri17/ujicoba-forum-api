/* eslint-disable max-len */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrate getting thread detail correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi thread ini',
      date: '2025-11-01T10:00:00.000Z',
      username: 'dicoding',
    };

    // NOTE: repos sekarang harus mengembalikan data mentah + flag is_delete
    const mockComments = [
      {
        id: 'comment-123',
        username: 'userA',
        date: '2025-11-01T11:00:00.000Z',
        content: 'Komentar pertama', // raw content
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'userB',
        date: '2025-11-01T12:00:00.000Z',
        content: 'Komentar kedua (awal)', // raw content tetap disimpan di DB
        is_delete: true, // flag menunjukkan sudah dihapus sehingga use-case yg mask
      },
    ];

    const mockRepliesForComment123 = [
      {
        id: 'reply-123',
        content: 'Balasan pertama',
        date: '2025-11-01T13:00:00.000Z',
        username: 'userC',
        is_delete: false,
      },
    ];

    const mockRepliesForComment456 = [
      {
        id: 'reply-456',
        content: 'Balasan kedua (awal)',
        date: '2025-11-01T14:00:00.000Z',
        username: 'userD',
        is_delete: true,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = {};

    /** mocking needed functions */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation((commentId) => {
        if (commentId === 'comment-123') return Promise.resolve(mockRepliesForComment123);
        if (commentId === 'comment-456') return Promise.resolve(mockRepliesForComment456);
        return Promise.resolve([]);
      });

    // like counts for comments
    mockLikeRepository.getLikeCountByCommentId = jest.fn()
      .mockImplementation((commentId) => {
        if (commentId === 'comment-123') return Promise.resolve(2);
        if (commentId === 'comment-456') return Promise.resolve(0);
        return Promise.resolve(0);
      });

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const threadDetail = await getThreadUseCase.execute(useCasePayload);

    // Assert - repository interactions
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByCommentId)
      .toHaveBeenCalledTimes(mockComments.length);
    expect(mockReplyRepository.getRepliesByCommentId)
      .toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getRepliesByCommentId)
      .toHaveBeenCalledWith('comment-456');

    expect(mockLikeRepository.getLikeCountByCommentId)
      .toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.getLikeCountByCommentId)
      .toHaveBeenCalledWith('comment-456');

    // Assert - final shaped result (use-case harus melakukan masking + likeCount)
    expect(threadDetail).toStrictEqual({
      id: mockThread.id,
      title: mockThread.title,
      body: mockThread.body,
      date: mockThread.date,
      username: mockThread.username,
      comments: [
        {
          id: 'comment-123',
          username: 'userA',
          date: '2025-11-01T11:00:00.000Z',
          content: 'Komentar pertama', // not deleted so original content
          likeCount: 2,
          replies: [
            {
              id: 'reply-123',
              content: 'Balasan pertama',
              date: '2025-11-01T13:00:00.000Z',
              username: 'userC',
            },
          ],
        },
        {
          id: 'comment-456',
          username: 'userB',
          date: '2025-11-01T12:00:00.000Z',
          content: '**komentar telah dihapus**', // masked by use-case
          likeCount: 0,
          replies: [
            {
              id: 'reply-456',
              content: '**balasan telah dihapus**', // masked by use-case
              date: '2025-11-01T14:00:00.000Z',
              username: 'userD',
            },
          ],
        },
      ],
    });
  });
  it('should set likeCount to 0 when likeRepository not provided', async () => {
  // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi thread ini',
      date: '2025-11-01T10:00:00.000Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'userA',
        date: '2025-11-01T11:00:00.000Z',
        content: 'Komentar pertama',
        is_delete: false,
      },
    ];

    const mockRepliesForComment123 = [
      {
        id: 'reply-123',
        content: 'Balasan pertama',
        date: '2025-11-01T13:00:00.000Z',
        username: 'userC',
        is_delete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExists = jest.fn().mockResolvedValue();
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(mockComments);
    mockReplyRepository.getRepliesByCommentId = jest.fn().mockResolvedValue(mockRepliesForComment123);

    // Intentionally NOT providing likeRepository
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail.comments[0].likeCount).toBeDefined();
    expect(threadDetail.comments[0].likeCount).toEqual(0);
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
  });
});
