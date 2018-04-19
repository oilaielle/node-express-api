const Post = require("../models/Post");
const Profile = require("../models/Profile");

const validatePostInput = require("../validations/posts/posts");

exports.create = (req, res, next) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    next({ status: 422, message: errors });
    return;
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost
    .save()
    .then(post => res.json(post))
    .catch(err => next(err));
};

exports.get = (req, res, next) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => next(err));
};

exports.getById = (req, res, next) => {
  let errors = {};

  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => {
      errors.post = "No post found with that ID";
      next({ status: 422, message: errors });
    });
};

exports.remove = (req, res, next) => {
  let errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            errors.permission = "Forbidden";
            next({ status: 403, message: errors });
            return;
          }

          post
            .remove()
            .then(() => res.json({ success: true }))
            .catch(err => next(err));
        })
        .catch(err => {
          errors.post = "No post found with that ID";
          next({ status: 422, message: errors });
        });
    })
    .catch(err => next(err));
};

exports.like = (req, res, next) => {
  let errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            errors.like = "User already liked this post";
            next({ status: 422, message: errors });
            return;
          }

          post.likes.unshift({ user: req.user.id });
          post
            .save()
            .then(p => res.json(p))
            .catch(err => next(err));
        })
        .catch(err => {
          errors.post = "No post found with that ID";
          next({ status: 422, message: errors });
        });
    })
    .catch(err => next(err));
};

exports.unlike = (req, res, next) => {
  let errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            errors.like = "You have not yet liked this post";
            next({ status: 422, message: errors });
            return;
          }

          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);
          post
            .save()
            .then(p => res.json(p))
            .catch(err => next(err));
        })
        .catch(err => {
          errors.post = "No post found with that ID";
          next({ status: 422, message: errors });
        });
    })
    .catch(err => next(err));
};

exports.createComment = (req, res, next) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    next({ status: 422, message: errors });
    return;
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      post
        .save()
        .then(p => res.json(p))
        .catch(err => next(err));
    })
    .catch(err => {
      errors.post = "No post found";
      next({ status: 404, message: errors });
    });
};

exports.deleteComment = (req, res, next) => {
  let errors = {};

  Post.findById(req.params.id)
    .then(post => {
      if (
        post.comments.filter(
          comment => comment._id.toString() === req.params.commentId
        ).length === 0
      ) {
        errors.comment = "Comment does not exist";
        next({ status: 422, errors });
        return;
      }

      const removeIndex = post.comments
        .map(comment => comment._id.toString)
        .indexOf(req.params.commentId);

      post.comments.splice(removeIndex, 1);
      post
        .save()
        .then(p => res.json(p))
        .catch(err => next(err));
    })
    .catch(err => {
      errors.post = "No post found";
      next({ status: 404, message: errors });
    });
};
