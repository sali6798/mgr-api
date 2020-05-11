const router = require("express").Router();
const userRoutes = require("./user");
const groupRoutes = require("./group");
const postRoutes = require("./post");

// User routes
router.use("/user", userRoutes);

<<<<<<< HEAD
router.use("/group", groupRoutes);

router.use("/post", postRoutes);

module.exports = router;
=======
//Group routes
router.use("/group", groupRoutes);

//Post routes
router.use("/post", postRoutes);

module.exports = router;
>>>>>>> e69a5fae9e5437061ff60af16d92a230afd37bc2
