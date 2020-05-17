const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000/";


// when login is successful, retrieve user info
//      '/auth/login/success'
router.get("/login/success", (req, res) => {

    if (req.user) {
        res.json(
            {
                success: true,
                message: "user has successfully authenticated",
                user: req.user,
                cookies: req.cookies
            }
        );
    }
    return res.redirect(CLIENT_HOME_PAGE_URL)
});


// when login failed, send failed msg
//      '/auth/login/failed'
router.get("/login/failed", (req, res) => {

    res.status(401).json(
        {
            success: false,
            message: "user failed to authenticate."
        }
    );
});


// When logout, redirect to client
//      '/auth/logout'
router.get("/logout", (req, res) => {

    req.logout();
    req.session = null;
    res.redirect(CLIENT_HOME_PAGE_URL);
});


//Local login route
//      '/auth/login'
router.post('/login',(req, res, next) => {

    passport.authenticate('local', (error, user, info) => {
        if (error) {

            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json(error)
        }
        req.login(user, (error) => {
            if (error) {
console.log("2nd ERROR: ",error);

                const statusCode = error.statusCode || 500;
                return res.status(statusCode).json(error)
            }

            return res.redirect(CLIENT_HOME_PAGE_URL)
        })
    })(req, res, next);
});



// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     '/auth/facebook/redirect'
router.get('/facebook', passport.authenticate('facebook'));


// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
//      '/auth/facebook/redirect'
router.get('/facebook/redirect', (req, res, next) => {

    passport.authenticate('facebook', (error, user, info) => {
        if (error) {

            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json(error)
        }
        req.login(user, (error) => {
            if (error) {

                const statusCode = error.statusCode || 500;
                return res.status(statusCode).json(error)
            }

            return res.redirect(CLIENT_HOME_PAGE_URL)
        })
    })(req, res, next);
});


// Redirect the user to Twitter for authentication.  When complete,
// Twitter will redirect the user back to the application at
//     /auth/twitter/redirect
router.get("/twitter", passport.authenticate("twitter"));


// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
//      '/auth/twitter/redirect'
router.get('/twitter/redirect', (req, res, next) => {

    passport.authenticate('twitter', (error, user, info) => {
        if (error) {

            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json(error)
        }
        req.login(user, (error) => {
            if (error) {

                const statusCode = error.statusCode || 500;
                return res.status(statusCode).json(error)
            }

            return res.redirect(CLIENT_HOME_PAGE_URL)
        })
    })(req, res, next);
});

module.exports = router;