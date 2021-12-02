const mongoose = require("mongoose");
const { Schema } = mongoose;
const ProgressModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    lesson: {
        type: Schema.Types.ObjectId,
        ref: "lessons",
        required: true,
    },
    level: {
        type: Schema.Types.ObjectId,
        ref: "levels",
        required: true,
    },
    complete: {
        type: Boolean,
        required: true,
        default: false,
    },
});
module.exports = mongoose.model("progresses", ProgressModel);
