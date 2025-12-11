/* eslint-disable class-methods-use-this */
class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, threadId, owner } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_VALID_OWNER');
    }

    if (!threadId) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_VALID_THREAD');
    }

    if (!content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
