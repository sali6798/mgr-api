const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: "group name required"
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
