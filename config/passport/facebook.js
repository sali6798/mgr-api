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
console.log("_________P R O F I L E _________", profile);

            User.findOne({
                oauthProviderProfileId: profile.id
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
                        oauthProviderProfileId: profile.id,
                        // email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                        username: profile.username,
                        name: profile.displayName,
                        // profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null,
                        accessToken: token,
                        refreshToken: tokenSecret,
                        provider: profile.provider || 'twitter'
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