const router = require("express").Router();
const passport = require("passport");

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

            return res.redirect(process.env.CLIENT_HOME_PAGE_URL)
        })
    })(req, res, next);
});
module.exports = router;
