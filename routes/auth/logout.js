const router = require("express").Router();

// When logout, redirect to client
//      '/auth/logout'
router.get("/", (req, res) => {

    req.logout();
    req.session = null;
    res.redirect(process.env.CLIENT_HOME_PAGE_URL);
});

module.exports = router;