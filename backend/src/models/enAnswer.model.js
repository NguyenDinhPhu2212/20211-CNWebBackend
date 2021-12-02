const mongoose = require("mongoose");
const { Schema } = mongoose;

const AnswerSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: "questions",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "images",
        default: "6160f33c86d6f59b128f2e0f",
        required: true,
    },
});
module.exports = mongoose.model("enAnswers", AnswerSchema);
