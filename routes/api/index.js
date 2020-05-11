const router = require("express").Router();
const userRoutes = require("./user");
const groupRoutes = require("./group");
const postRoutes = require("./post");

// User routes
router.use("/user", userRoutes);

//Group routes
router.use("/group", groupRoutes);

//Post routes
router.use("/post", postRoutes);

module.exports = router;
