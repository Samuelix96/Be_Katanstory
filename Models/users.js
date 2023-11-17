const mongoose = require("mongoose")

const UsersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birth: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: [ "admin", "user"],
    },
    avatar: {
        type: String,
        required: true
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model("usersModel", UsersSchema, "users")