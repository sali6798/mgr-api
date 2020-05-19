const router = require("express").Router();
const twitterRoutes = require("./twitter");
const facebookRoutes = require("./facebook");

//twitter routes
router.use("/twitter", twitterRoutes);

//facebook routes
router.use("/facebook", facebookRoutes);

module.exports = router;