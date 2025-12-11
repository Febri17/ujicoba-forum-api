const NewLike = require('../../Domains/likes/entities/NewLike');

class ToggleLikeCommentUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    // verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);

    // verify comment exists
    await this._commentRepository.verifyCommentExists(commentId);

    // check current like state
    const isLiked = await this._likeRepository.isLiked(commentId, owner);

    if (isLiked) {
      // if already liked, remove like
      await this._likeRepository.deleteLike(commentId, owner);
    } else {
      // if not liked, add like
      const newLike = new NewLike({ commentId, owner });
      await this._likeRepository.addLike(newLike);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;
