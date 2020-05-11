const router = require("express").Router();
const userRoutes = require("./user");
const groupRoutes = require("./group");
const postRoutes = require("./post");

// User routes
router.use("/user", userRoutes);

router.use("/group", groupRoutes);

router.use("/post", postRoutes);

module.exports = router;
