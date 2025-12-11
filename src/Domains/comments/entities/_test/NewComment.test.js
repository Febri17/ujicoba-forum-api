const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain valid owner or missing authentication', () => {
    // Arrange
    const payload = {
      content: 'abc',
      threadId: 'abc',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_CONTAIN_VALID_OWNER');
  });

  it('should throw error when payload did not contain valid thread or thread not found', () => {
    // Arrange
    const payload = {
      content: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_CONTAIN_VALID_THREAD');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'abc',
      threadId: 'abc',
      owner: 'abc',
    };

    // Action
    const { content, threadId, owner } = new NewComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
