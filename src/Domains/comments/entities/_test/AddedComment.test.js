const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 123,
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should show AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'abc',
      owner: 'abc',
    };

    // Action
    const { id, content, owner } = new AddedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
