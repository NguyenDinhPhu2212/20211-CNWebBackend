const UserModel = require("../models/user.model");
const TokenModel = require("../models/token.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginValidate } = require("../utils/validates/account.validate");
const json_key = process.env.JSON_WEB_TOKEN_KEY || "jsonwebtokenkey";
const ResponseMessage = require("../utils/ResponseMessage");
class AccountController {
    /* 
        Login
        [POST] /login
    */
    async login(req, res) {
        try {
            // validate
            const { error, value } = loginValidate(req.body);
            if (error)
                return res
                    .status(400)
                    .json(
                        ResponseMessage.create(
                            false,
                            {},
                            error.details[0].message
                        )
                    );

            // check username exists
            const findUser = await UserModel.findOne({
                username: value.username,
            }).populate("avatar");
            if (!findUser)
                return res
                    .status(401)
                    .json(
                        ResponseMessage.create(
                            false,
                            {},
                            "Account or Password is not correct"
                        )
                    );

            // check password
            const checkPassword = bcrypt.compareSync(
                value.password,
                findUser.password
            );
            if (!checkPassword)
                return res
                    .status(401)
                    .json(
                        ResponseMessage.create(
                            false,
                            {},
                            "Account or Password is not correct"
                        )
                    );

            // json web token
            const token = jwt.sign(
                { id: findUser._id, slug: findUser.slug },
                json_key,
                { expiresIn: "2h" }
            );

            // save database
            const newToken = new TokenModel({ user: findUser._id, token });
            await newToken.save();
            // return token for client
            res.status(200).json(
                ResponseMessage.create(
                    true,
                    {
                        slug: findUser.slug,
                        role: findUser.role,
                        username: findUser.username,
                        avatar: findUser.avatar?.filename,
                        token,
                    },
                    "Login success"
                )
            );
        } catch (error) {
            res.status(500).json(
                ResponseMessage.create(
                    false,
                    {},
                    "The server has an error",
                    error.message
                )
            );
        }
    }

    /* 
        Logout
        [POST] /logout
   */
    async logout(req, res) {
        try {
            const token = req.header("token");
            await TokenModel.findOneAndUpdate({ token }, { status: "deleted" });
            res.status(200).json(
                ResponseMessage.create(true, {}, "Logout success")
            );
        } catch (error) {
            res.status(500).json(
                ResponseMessage.create(
                    false,
                    {},
                    "The server has an error",
                    error.message
                )
            );
        }
    }
}

module.exports = new AccountController();
