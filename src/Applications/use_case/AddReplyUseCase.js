const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId } = useCasePayload;
    // verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);

    // verify comment exists
    await this._commentRepository.verifyCommentExists(commentId);

    const newReply = new NewReply(useCasePayload);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
