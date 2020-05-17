require('dotenv').config();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../models/User");

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:8080/auth/facebook/redirect"
        },
        function (token, tokenSecret, profile, cb) {

            User.findOne({
                facebookId: profile.id
            }).then((user, err) => {

                if (err) {
                    return cb(err, null);
                }
                if (user) {

                    return cb(null, user);
                }

                else {
                    console.log(profile);

                    let newUser = new User({
                        facebookId: profile.id,
                        name: profile.displayName,
                        facebookAccessToken: token,
                        facebookRefreshToken: tokenSecret,
                    });

                    newUser.save((error, inserted) => {
                        if (error) {
                            return cb(error, null);
                        }

                        return cb(null, inserted);
                    });
                }
            });
        }
    )
);

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(e => {
            done(new Error("Failed to deserialize a user"));
        });
});