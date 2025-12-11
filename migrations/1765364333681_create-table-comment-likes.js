/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // composite primary key to prevent duplicate likes
  pgm.addConstraint('comment_likes', 'pk_comment_likes', 'PRIMARY KEY(comment_id, user_id)');

  // foreign keys
  pgm.addConstraint('comment_likes', 'fk_comment_likes.comment_id_comments(id)', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('comment_likes', 'fk_comment_likes.user_id_users(id)', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

  // index to speed up counts/queries
  pgm.createIndex('comment_likes', ['comment_id', 'user_id']);
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
