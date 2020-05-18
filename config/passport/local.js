const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/User");

passport.use(
    new LocalStrategy(function (email, password, done) {
        // console.log('ASGGQERG'); //THIS DOESN'T PRINT

        User.findOne({ email: email }, function (err, user) {
            // console.log(user); //THIS DEOSN'T PRINT

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

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
    console.log("SERIALIZE");
    
    const newUser = {
        email: user.email,
        name: user.name,
        isManager: user.isManager,
        id: user._id
    };
    console.log(newUser);

    done(null, newUser);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
    console.log('DESERIALIZE');
    
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(e => {
            done(new Error("Failed to deserialize a user"));
        });
});