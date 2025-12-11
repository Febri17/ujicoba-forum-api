/* eslint-disable class-methods-use-this */
class NewLike {
  constructor(payload) {
    this._verifyPayload(payload);
    const { commentId, owner } = payload;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({ commentId, owner }) {
    if (!owner) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_VALID_OWNER');
    }

    if (!commentId) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_VALID_COMMENT');
    }

    if (typeof commentId !== 'string') {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewLike;
