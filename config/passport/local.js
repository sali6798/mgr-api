const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/User");

passport.use(
    new LocalStrategy(function (email, password, done) {

        User.findOne({ email: email }, function (err, user) {

            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password != password) {
                return done(null, false);
            }
            console.log(user);

            return done(null, user);
        });
    })
);