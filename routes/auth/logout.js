const router = require("express").Router();

// When logout, redirect to client
//      '/auth/logout'
router.get("/", (req, res) => {
    req.logout();
    req.session = null;
    res.status(200).json("logged out");
});

module.exports = router;