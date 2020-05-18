const passport = require("passport");
const User = require("../../models/User");
const Twitter = require("./twitter");
const Facebook = require("./facebook");
const Local = require("./local");

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
    console.log("SERIALIZE");
    done(null, user);
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
