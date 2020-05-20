const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/User");


// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     '/auth/facebook'
router.get('/', passport.authenticate('facebook'));


// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
//      '/auth/facebook/redirect'
router.get('/redirect', (req, res, next) => {

    passport.authenticate('facebook', async function (error, user, info) {

        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    facebookId: user.facebookId,
                    facebookAccessToken: user.facebookAccessToken
                }
            )

            await req.login(updatedUser);

            return res.redirect('http://localhost:3000/myaccount');

        } catch (error) {
            res.json(error)
        }

    })(req, res, next);
});

module.exports = router;