const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    eventTitle: {
        type: String,
        trim: true
    },
    body: {
        type: String,
        trim: true
    },
    imageLinks: Array,
    release: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        default: "draft"
    }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
