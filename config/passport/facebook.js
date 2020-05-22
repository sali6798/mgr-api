require('dotenv').config();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../models/User");

// const axios = require("axios")

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_REDIRECT
        },
        function (token, tokenSecret, profile, cb) {

            User.findOne({
                facebookId: profile.id
            }).then(async (user, err) => {

                if (err) {
                    return cb(err, null);
                }
                if (user) {

                    return cb(null, user);
                }

                else {
                    let newUser = new User({
                        facebookId: profile.id,
                        name: profile.displayName,
                        facebookAccessToken: token,
                    });
                    console.log(newUser);

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