const router = require("express").Router();
// const apiRoutes = require("./api");

// API Routes
// router.use("/api", apiRoutes);

router.get("*", (req, res) => {
    res.send("welcome to my api!")
})

module.exports = router;


// var allRoutes = require('./controllers');