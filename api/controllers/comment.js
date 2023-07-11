const path = require('path');
const root = path.resolve('.');
const constants = require(`${root}/const`);
const { database } = require(`${root}/api/services`);

const sort = {
  order: [
    ['createdAt', 'DESC'],
  ],
};

async function getLikeStatus (comments, userId) {
  const isArray = Array.isArray(comments);
  comments = isArray ? comments : [ comments ];

  const result = await Promise.all(comments.map(async (comment) => {
    const lbu = await database.findOne('CommentLike', {
      userId,
      commentId: comment.id,
    });
    comment.likedByUser = lbu ? true : false;
    return comment;
  }));

  return isArray ? result : result[0];
}

async function getUserData (comments) {
  const isArray = Array.isArray(comments);
  comments = isArray ? comments : [ comments ];

  const result = await Promise.all(comments.map (async (comment) => {
    const user = await database.findOne('User', {
      id: comment.userId,
    });

    comment.name = user.name;
    comment.photo = user.photo;
    delete comment.updatedAt;
    delete comment.userId;
    delete comment.likes;

    return comment;
  }));

  return isArray ? result : result[0];
}

module.exports.get = async (req, _) => {
  const searcher = req.requester;
  const where = { userId: req.params.user || searcher };

  const comments = await database.findAll('Comment', where, sort);
  return {
    ...constants['200'],
    // body: await getLikeStatus(comments, searcher),
    body: await getUserData(comments),
  };
};

module.exports.getList = async (req, _) => {
  const p = await database.findOne('Post', {
    id: req.params.post,
  });
  if (!p) return {
    ...constants['404'],
    message: 'Post tidak ditemukan!',
  };

  const comments = await database.findAll('Comment', {
    postId: p.id,
  }, sort);
  return {
    ...constants['200'],
    // body: await getLikeStatus(comments, req.requester),
    body: await getUserData(comments),
  };
};

module.exports.find = async (req, _) => {
  const c = await database.findOne('Comment', {
    id: req.params.comment,
  });
  if (!c) return {
    ...constants['404'],
    message: 'Comment tidak ditemukan!',
  };
  return {
    ...constants['200'],
    // body: await getLikeStatus(c, req.requester),
    body: await getUserData(comments),
  };
};

module.exports.upload = async (req, _) => {
  req.payload.likes = 0;
  req.payload.userId = req.requester;

  const p = await database.findOne('Post', {
    id: req.payload.postId,
  });
  if (!p) return {
    ...constants['404'],
    message: 'Post tidak ditemukan!',
  };

  await database.create('Comment', req.payload);

  return this.getList({
    params: { post: req.payload.postId },
    requester: req.requester,
  });
};

module.exports.update = async (req, _) => {
  const where = { id: req.payload.id };
  const c = await database.findOne('Comment', where);

  if (!c) return {
    ...constants['404'],
    message: 'Comment not found!',
  };
  if (c.userId !== req.requester) return {
    ...constants['403'],
    message: 'Permission denied!',
  };

  await database.update('Comment', req.payload, where);

  return this.find({
    requester: req.requester,
    params: { comment: c.id },
  });
};

module.exports.delete = async (req, _) => {
  const where = { id: req.payload.id };
  const c = await database.findOne('Comment', where);

  if (!c) return {
    ...constants['404'],
    message: 'Comment not found!',
  };
  if (c.userId !== req.requester) return {
    ...constants['403'],
    message: 'Permission denied!',
  };

  await database.delete('Comment', where);

  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.like = async (req, _) => {
  const data = {
    userId: req.requester,
    commentId: req.payload.id,
  };

  const where = { id: data.commentId };
  const comment = await database.findOne('Comment', where);
  if (!comment) return {
    ...constants['404'],
    message: 'Comment not found!',
  };

  const c = await getLikeStatus(comment, data.userId);
  const likes = c.likedByUser ? c.likes - 1 : c.likes + 1;
  const method = c.likedByUser ? 'delete' : 'create';

  await database[method]('CommentLike', data);
  await database.update('Comment', { likes }, where);

  return this.find({
    requester: req.requester,
    params: { comment: c.id },
  });
};
