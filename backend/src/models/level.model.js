const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const slugOptions = require("../core/config/slug.config");
mongoose.plugin(slug, slugOptions);
const { Schema } = mongoose;

const LevelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        slug: ["name"],
        unique: true,
    },
});

module.exports = mongoose.model("levels", LevelSchema);
