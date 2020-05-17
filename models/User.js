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
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: "Group"
        }
    ],
    profileImage: {
        type: String,
        trim: true
    },
    oauthProviderProfileId: {
        type: String,
        trim: true
    },
    accessToken: {
        type: String,
        trim: true
    },
    refreshToken: {
        type: String,
        trim: true
    },
    provider: {
        type: String,
        trim: true
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
