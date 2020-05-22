const router = require("express").Router();
const passport = require("passport");


//Local login route
//      '/auth/login'
router.post('/', (req, res, next) => {
  
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            // console.log("1st ERROR", error);

            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json(error)
        }
        req.login(user, (error) => {
            // console.log("req.user", req.user);

            if (error) {
                // console.log("2nd ERROR: ", error);

                const statusCode = error.statusCode || 500;
                return res.status(statusCode).json(error)
            }

            return res.json(user);
        })
    })(req, res, next);
});

// when login is successful, retrieve user info
//      '/auth/login/success'
router.get("/success", (req, res) => {

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
    return res.redirect(process.env.CLIENT_HOME_PAGE_URL)
});


// when login failed, send failed msg
//      '/auth/login/failed'
router.get("/failed", (req, res) => {

    res.status(401).json(
        {
            success: false,
            message: "user failed to authenticate."
        }
    );
});

module.exports = router;

{/* <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-text="Tweet body" data-url="http://url.com" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> */}