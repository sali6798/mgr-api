const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/User");


// Redirect the user to Twitter for authentication.  When complete,
// Twitter will redirect the user back to the application at
//     /auth/twitter/
router.get("/", passport.authenticate("twitter"));


// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
//      '/auth/twitter/redirect'
router.get('/redirect', (req, res, next) => {

    passport.authenticate('twitter', async function (error, user, info) {

        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    twitterId: user.twitterId,
                    twitterAccessToken: user.twitterAccessToken,
                    twitterRefreshToken: user.twitterRefreshToken
                }
            )

            await req.login(updatedUser, (error) => {

                console.log('right before redirect', process.env.CLIENT_HOME_PAGE_URL);
                return res.redirect(process.env.CLIENT_HOME_PAGE_URL);

            });

            return res.redirect(process.env.CLIENT_HOME_PAGE_URL);

        } catch (error) {
            res.json(error)
        }

    })(req, res, next);
});

module.exports = router;