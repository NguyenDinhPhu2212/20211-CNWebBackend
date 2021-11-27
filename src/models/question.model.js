const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema({
    lesson: {
        type: Schema.Types.ObjectId,
        ref: "lessons",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["en", "vi"],
        default: "vi",
        required: true,
    },
    number: {
        type: Number,
        required: true,
        default: 0,
    },
});
module.exports = mongoose.model("questions", QuestionSchema);
