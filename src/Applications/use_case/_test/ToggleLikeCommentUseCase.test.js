/* eslint-disable max-len */
const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');

describe('ToggleLikeCommentUseCase', () => {
  it('should add like when comment not liked yet', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockLikeRepository = {};
    const mockThreadRepository = {};
    const mockCommentRepository = {};

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.isLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLiked).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(expect.objectContaining({
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    }));
    expect(mockLikeRepository.deleteLike).not.toHaveBeenCalled();
  });

  it('should delete like when comment already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockLikeRepository = {};
    const mockThreadRepository = {};
    const mockCommentRepository = {};

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.isLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLiked).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.addLike).not.toHaveBeenCalled();
  });
});
