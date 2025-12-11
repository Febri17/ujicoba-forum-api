const NewLike = require('../NewLike');

describe('NewLike entities', () => {
  it('should throw error when payload did not contain valid owner or missing authentication', () => {
    // Arrange
    const payload = {
      commentId: 'abc',
    };

    // Action and Assert
    expect(() => new NewLike(payload)).toThrow('NEW_LIKE.NOT_CONTAIN_VALID_OWNER');
  });

  it('should throw error when payload did not contain valid comment or comment not found', () => {
    // Arrange
    const payload = {
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewLike(payload)).toThrow('NEW_LIKE.NOT_CONTAIN_VALID_COMMENT');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewLike(payload)).toThrow('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'abc',
      owner: 'abc',
    };

    // Action
    const { commentId, owner } = new NewLike(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
