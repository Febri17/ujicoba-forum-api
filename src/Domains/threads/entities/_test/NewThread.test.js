const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain valid owner or missing authentication', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_CONTAIN_VALID_OWNER');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'abc',
      title: 'abc',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 'abc',
      title: 'abc',
      body: true,
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      owner: 'abc',
      title: 'abc',
      body: 'abc',
    };

    // Action
    const { title, body, owner } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
