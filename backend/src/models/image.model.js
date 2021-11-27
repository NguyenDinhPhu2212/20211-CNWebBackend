const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageModel = new Schema({
    filename: {
        type: String,
        required: true,
    },
    content_type: {
        type: String,
        required: true,
    },
    created: {
        type: Number,
        default: Date.now(),
        required: true,
    },
    updated: {
        type: Number,
        default: null,
    },
});

module.exports = mongoose.model("images", ImageModel);
