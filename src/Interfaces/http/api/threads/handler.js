const autoBind = require('auto-bind');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const ToggleLikeCommentUseCase = require('../../../../Applications/use_case/ToggleLikeCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    // owner from access token
    const { id: owner } = request.auth.credentials;
    const payload = { ...request.payload, owner };
    const addedThread = await addThreadUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const { threadId } = request.params;
    const result = await getThreadUseCase.execute({ threadId });

    return {
      status: 'success',
      data: {
        thread: result,
      },
    };
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const payload = { ...request.payload, threadId, owner };
    const addedComment = await addCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    await deleteCommentUseCase.execute({ commentId, owner });
    return {
      status: 'success',
    };
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const payload = {
      ...request.payload, threadId, commentId, owner,
    };
    const addedReply = await addReplyUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    await deleteReplyUseCase.execute({ replyId, owner });
    return {
      status: 'success',
    };
  }

  async putLikeCommentHandler(request) {
    // toggle like on comment
    const toggleLikeCommentUseCase = this._container.getInstance(ToggleLikeCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    await toggleLikeCommentUseCase.execute({ threadId, commentId, owner });

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
