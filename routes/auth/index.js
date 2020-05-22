const router = require("express").Router();
const localRoutes = require("./local");
const twitterRoutes = require("./twitter");
const facebookRoutes = require("./facebook");
const logoutRoute = require("./logout")

// local routes
router.use("/login", localRoutes);

//twitter routes
router.use("/twitter", twitterRoutes);

//facebook routes
router.use("/facebook", facebookRoutes);

//logout
router.use("/logout", logoutRoute);

module.exports = router;