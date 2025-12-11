const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
  it('should throw error when payload did not contain valid owner or missing authentication', () => {
    // Arrange
    const payload = {
      content: 'abc',
      threadId: 'abc',
      commentId: 'abc',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrow('NEW_REPLY.NOT_CONTAIN_VALID_OWNER');
  });

  it('should throw error when payload did not contain valid thread or thread not found', () => {
    // Arrange
    const payload = {
      content: 'abc',
      commentId: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrow('NEW_REPLY.NOT_CONTAIN_VALID_THREAD');
  });

  it('should throw error when payload did not contain valid comment or comment not found', () => {
    // Arrange
    const payload = {
      content: 'abc',
      threadId: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrow('NEW_REPLY.NOT_CONTAIN_VALID_COMMENT');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'abc',
      commentId: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrow('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: 'abc',
      commentId: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrow('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'abc',
      threadId: 'abc',
      commentId: 'abc',
      owner: 'abc',
    };

    // Action
    const {
      content, threadId, commentId, owner,
    } = new NewReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
