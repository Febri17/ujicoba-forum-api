/* eslint-disable class-methods-use-this */
class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      content, threadId, commentId, owner,
    } = payload;
    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({
    content, threadId, commentId, owner,
  }) {
    if (!owner) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_VALID_OWNER');
    }

    if (!threadId) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_VALID_THREAD');
    }

    if (!commentId) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_VALID_COMMENT');
    }

    if (!content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
