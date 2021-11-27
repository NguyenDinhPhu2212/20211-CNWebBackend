const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const validateLevel = (data) => {
    const Schema = joi.object({
        name: joi.string().required("Level name is required").min(4),
    });
    return Schema.validate(data);
};
const validateLesson = (data) => {
    const Schema = joi.object({
        name: joi.string().required(),
        image: joi.objectId().required(),
    });
    return Schema.validate(data);
};
module.exports = { validateLevel, validateLesson };
