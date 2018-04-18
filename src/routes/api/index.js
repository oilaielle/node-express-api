const router = require("express").Router();

const posts = require("./posts");
const profile = require("./profile");
const users = require("./users");

router.use("/posts", posts);
router.use("/profile", profile);
router.use("/users", users);

module.exports = router;
