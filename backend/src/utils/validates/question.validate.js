const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const validateQuestion = (data) => {
    const Schema = joi.object({
        question: joi
            .object({
                content: joi.string().min(1),
                type: joi.string().valid("en", "vi").required(),
            })
            .required(),
        answer: joi
            .array()
            .items(
                joi.object({
                    content: joi.string().required(),
                    image: joi
                        .objectId()
                        .when("question.type", {
                            is: "vi",
                            then: joi.required(),
                        }),
                })
            )
            .when("question.type", {
                is: "en",
                then: joi.array().min(1),
                otherwise: joi.array().length(1),
            }),
    });
    return Schema.validate(data);
};
module.exports = { validateQuestion };
