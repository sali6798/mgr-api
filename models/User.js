const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: "first name required"
    },
    lastName: {
        type: String,
        trim: true,
        required: "last name required"
    },
    email: {
        type: String,
        trim: true,
        unique: true,
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
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
