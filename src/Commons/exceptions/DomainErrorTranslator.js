const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  // register user
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),

  // user login
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),

  // refresh token
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  // threads
  'NEW_THREAD.NOT_CONTAIN_VALID_OWNER': new InvariantError('Missing authentication'),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('isi thread kurang'),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('isi thread tidak benar'),
  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('isi thread kurang'),
  'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('isi thread tidak benar'),

  // comments
  'NEW_COMMENT.NOT_CONTAIN_VALID_OWNER': new InvariantError('Missing authentication'),
  'NEW_COMMENT.NOT_CONTAIN_VALID_THREAD': new InvariantError('thread tidak ditemukan'),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('isi comment kurang'),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('isi comment tidak benar'),
  'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('isi comment kurang'),
  'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('isi comment tidak benar'),

  // replies
  'NEW_REPLY.NOT_CONTAIN_VALID_OWNER': new InvariantError('Missing authentication'),
  'NEW_REPLY.NOT_CONTAIN_VALID_THREAD': new InvariantError('thread tidak ditemukan'),
  'NEW_REPLY.NOT_CONTAIN_VALID_COMMENT': new InvariantError('comment tidak ditemukan'),
  'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('isi reply kurang'),
  'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('isi reply tidak benar'),
  'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('isi reply kurang'),
  'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('isi reply tidak benar'),

  // likes
  'NEW_LIKE.NOT_CONTAIN_VALID_OWNER': new InvariantError('Missing authentication'),
  'NEW_LIKE.NOT_CONTAIN_VALID_COMMENT': new InvariantError('comment tidak ditemukan'),
  'NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('isi reply tidak benar'),
};

module.exports = DomainErrorTranslator;
