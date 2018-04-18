const router = require("express").Router();
const passport = require("passport");

const UserController = require("../../controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  UserController.current
);

module.exports = router;
