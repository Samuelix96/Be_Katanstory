const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
}, { timestamps: true, strict: true})

module.exports = mongoose.model("postsModel", PostsSchema, "posts")