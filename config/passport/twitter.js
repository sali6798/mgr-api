require('dotenv').config();
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const User = require("../../models/User");


passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: "http://localhost:8080/auth/twitter/redirect"
        },
        function (token, tokenSecret, profile, cb) {
            
            User.findOne({
                twitterId: profile.id
            }).then((user, err) => {
                            
                if (err) {
                    return cb(err, null);
                }
                if (user) {
                    //put req.
                    return cb(null, user);
                }

                else {
                    let newUser = new User({
                        twitterId: profile.id,
                        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                        name: profile.displayName,
                        profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null,
                        twitterAccessToken: token,
                        twitterRefreshToken: tokenSecret,
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