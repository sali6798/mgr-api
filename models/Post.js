const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    body: {
        type: String,
        trim: true
    },
    imageLinks: Array,
    release: {
        type: Date,
        default: null
    }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
