const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000/";

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
    if (req.user) {
        console.log(req.user);

        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
    return res.redirect(CLIENT_HOME_PAGE_URL)
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
    });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.redirect(CLIENT_HOME_PAGE_URL);
});

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        console.log("req.body ", req.body);

        return res.redirect(CLIENT_HOME_PAGE_URL)
    });

// auth with twitter
router.get("/twitter", passport.authenticate("twitter"));

// redirect to home page after successfully login via twitter
router.get('/twitter/redirect', (req, res, next) => {

    passport.authenticate('twitter', (error, user, info) => {
        if (error) {
            const statusCode = error.statusCode || 500;
            console.log("if err");

            return res.status(statusCode).json(error)
        }
        req.login(user, (error) => {
            if (error) {
                const statusCode = error.statusCode || 500;
                console.log("req.login");

                return res.status(statusCode).json(error)
            }
            // return res.json(user)
            return res.redirect(CLIENT_HOME_PAGE_URL)
        })
    })(req, res, next);
});

module.exports = router;