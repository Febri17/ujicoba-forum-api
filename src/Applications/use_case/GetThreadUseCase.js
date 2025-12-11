// GetThreadUseCase.js
class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;

    // constants untuk pesan ketika item dihapus — mudah diubah di satu tempat
    this.DELETED_COMMENT_TEXT = '**komentar telah dihapus**';
    this.DELETED_REPLY_TEXT = '**balasan telah dihapus**';
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    // pastikan thread ada
    await this._threadRepository.verifyThreadExists(threadId);

    // ambil data thread dasar
    const thread = await this._threadRepository.getThreadById(threadId);

    // ambil komentar mentah dari repo (harus menyertakan is_delete flag)
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    // untuk setiap komentar, ambil balasan dan lakukan masking di sini (use-case)
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

      // Mask comment content berdasarkan flag is_delete jika ada
      const commentIsDeleted = Object.prototype.hasOwnProperty.call(comment, 'is_delete') && comment.is_delete;
      const commentContent = commentIsDeleted ? this.DELETED_COMMENT_TEXT : comment.content;

      // Map replies — kalau repo mengembalikan is_delete, mask di sini juga.
      const mappedReplies = replies.map((r) => {
        const replyIsDeleted = Object.prototype.hasOwnProperty.call(r, 'is_delete') && r.is_delete;
        return {
          id: r.id,
          content: replyIsDeleted ? this.DELETED_REPLY_TEXT : r.content,
          date: r.date,
          username: r.username,
        };
      });

      // get like count for this comment (0 if none)
      let likeCount = 0;
      if (this._likeRepository && typeof this._likeRepository.getLikeCountByCommentId === 'function') {
        likeCount = await this._likeRepository.getLikeCountByCommentId(comment.id);
      }

      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: commentContent,
        likeCount,
        replies: mappedReplies,
      };
    }));

    // bentuk response akhir
    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: commentsWithReplies,
    };
  }
}

module.exports = GetThreadUseCase;
