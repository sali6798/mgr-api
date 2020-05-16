require('dotenv').config();
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const keys = require("../keys");
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
                profileId: profile.id
            }).lean().exec((err, user) => {
                if (err) {
                    return cb(err, null);
                }
                if (user) {
                    return cb(null, user);
                }
                console.log(profile);

                let newUser = new User({
                    oauthProviderProfileId: profile.id,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                    username:profile.username,
                    name: profile.displayName,
                    profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null,
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
            });
        }
    )
)

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
