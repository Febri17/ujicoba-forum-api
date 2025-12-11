const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 123,
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should show AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'abc',
      owner: 'abc',
    };

    // Action
    const { id, content, owner } = new AddedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
