const router = require("express").Router();

const api = require("./api");
const notfound = require("./404");
const error = require("./error");

router.use("/api", api);
router.use(notfound);
router.use(error);

module.exports = router;
