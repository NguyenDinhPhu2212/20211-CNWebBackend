const joi = require("joi");

const createUserValidate = (data) => {
    const Schema = joi.object({
        username: joi
            .string()
            .alphanum()
            .min(4)
            .max(200)
            .required("Username is required"),
        email: joi
            .string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required("Email is required"),
        password: joi
            .string()
            .pattern(new RegExp("^[a-zA-Z0-9]{8,}$"))
            .min(8)
            .required("Password is required")
            .messages({
                "string.pattern.base": `Password is string only contain a-z, A-Z, 0-9`,
            }),
        password_confirm: joi.string().required("Password confirm is required"),
    });
    return Schema.validate(data);
};

const updateUserValidate = (data) => {
    const Schema = joi.object({
        email: joi
            .string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    });
    return Schema.validate(data);
};

// validate change password
const validateChangePassword = (data) => {
    const schema = joi.object({
        current_password: joi.string().required("Password current is required"),
        new_password: joi
            .string()
            .pattern(new RegExp("^[a-zA-Z0-9]{8,}$"))
            .required("New password is required")
            .messages({
                "string.pattern.base": `Password is string only contain a-z, A-Z, 0-9`,
            }),
        confirm_password: joi
            .string()
            .required("New password confirm is required"),
    });
    return schema.validate(data);
};

module.exports = {
    createUserValidate,
    updateUserValidate,
    validateChangePassword,
};
