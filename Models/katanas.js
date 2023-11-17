const mongoose = require("mongoose");

const KatanasSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
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
    width: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true,
    }, 
    location: {
        type: String,
        required: false,
        default: "japan"
    },
    age: {
        type: String, 
        required: false,
        default: "18 century"
    },
    thickness: {
        type: Number,
        required: false,
        default: 0.3,
    },
}, { timestamps: true, strict: true })

module.exports= mongoose.model("katanasModel", KatanasSchema, "katanas")