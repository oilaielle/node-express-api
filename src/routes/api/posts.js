const router = require("express").Router();
const passport = require("passport");

const PostController = require("../../controllers/PostController");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  PostController.create
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  PostController.getById
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  PostController.remove
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  PostController.get
);

router.post(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  PostController.like
);

router.delete(
  "/:id/unlike",
  passport.authenticate("jwt", { session: false }),
  PostController.unlike
);

router.post(
  "/:id/comment",
  passport.authenticate("jwt", { session: false }),
  PostController.createComment
);

router.delete(
  "/:id/comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  PostController.deleteComment
);

module.exports = router;
