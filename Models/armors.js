const mongoose = require("mongoose")

const ArmorsSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    image2: {
        type: String,
        required: true
    },
    image3: {
        type: String,
        required: true
    },
    image4: {
        type: String,
        required: true
    },
    image5: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    helmet: {
        type: String,
        required: true
    },
    mask: {
        type: String,
        required: true
    },
    armor: {
        type: String,
        required: true
    },

    sleeves: {
        type: String,
        required: true
    },
}, { timestamps:true, strict:true })

module.exports = mongoose.model("armorsModel", ArmorsSchema, "armors")