const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: "name is required"
    },
    email: {
        type: String,
        trim: true,
        // unique: true,
        match: [/^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,7}$/g, "Please enter a valid email address"]
    },
    password: {
        type: String,
        trim: true,
        validate: [({ length }) => length >= 8, "Password needs to be at least 8 characters"]
    },
    isManager: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        trim: true
    },
    twitterId: {
        type: String,
        trim: true
    },
    twitterAccessToken: {
        type: String,
        trim: true
    },
    twitterRefreshToken: {
        type: String,
        trim: true
    },
    facebookId: {
        type: String,
        trim: true
    },
    facebookAccessToken: {
        type: String,
        trim: true
    },
    facebookRefreshToken: {
        type: String,
        trim: true
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
