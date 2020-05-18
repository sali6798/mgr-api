const express = require('express');
const session = require("express-session");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const MongoStore = require('connect-mongo')(session);
const routes = require("./routes");
const passportSetupTwitter = require("./config/passport/twitter");
const passportSetupFacebook = require("./config/passport/facebook");
const passportSetupLocal = require("./config/passport/local");
const keys = require("./config/passport/twitter");


// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

app.use(logger("dev"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 100
}));

//initialize passport
app.use(passport.initialize());

//deserialize cookies
app.use(passport.session());


//Sets up cors to allow client requests
app.use(
    cors({
        origin: ["http://localhost:3000"],
        // origin: ["https://mgr-talent.herokuapp.com"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true //allow session cookie to pass through
    })
);
// app.use(cors({
//     origin: ["https://mgr-talent.herokuapp.com"]
// }));

app.use(routes);

mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/mgr",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.listen(PORT, function () {
    console.log('App listening on PORT ' + PORT);
});