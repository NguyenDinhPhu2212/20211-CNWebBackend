const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const slugOptions = require("../core/config/slug.config");
mongoose.plugin(slug, slugOptions);
const { Schema } = mongoose;
const LessonSchema = new Schema({
    level: {
        type: Schema.Types.ObjectId,
        ref: "levels",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        slug: ["name"],
        unique: true,
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "images",
        default: "6160f33c86d6f59b128f2e0f",
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
});
module.exports = mongoose.model("lessons", LessonSchema);
