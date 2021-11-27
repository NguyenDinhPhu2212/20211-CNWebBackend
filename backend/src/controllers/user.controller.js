const UserModel = require("../models/user.model");
const ImageModel = require("../models/image.model");
const bcrypt = require("bcrypt");
const multer = require("multer");
const {
    createUserValidate,
    updateUserValidate,
    validateChangePassword,
} = require("../utils/validates/user.validate");
const saltRounds = process.env.SALT_ROUNDS;
const ResponseMessage = require("../utils/ResponseMessage");
const { upload } = require("../core/config/upload_image.config");
class UserController {
    /*
        Get all users
        [GET] /user
    */
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find()
                .populate("avatar")
                .select("-_id -__v -password");

            return res.status(200).json(ResponseMessage.create(true, users));
        } catch (error) {
            console.log(error);
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
        Get user
        [GET] /user/profile/:slug_user
    */
    async getUser(req, res) {
        try {
            const slug_user = req.params.slug_user;
            // find user
            const findUserInfo = await UserModel.findOne({
                slug: slug_user,
            }).populate("avatar");
            if (!findUserInfo)
                return res
                    .status(404)
                    .json(
                        ResponseMessage.create(false, {}, "User is not exist")
                    );
            const { username, slug, email, avatar, created } = findUserInfo;

            res.status(200).json(
                ResponseMessage.create(true, {
                    username,
                    slug,
                    email,
                    avatar: avatar?.filename,
                    created,
                })
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
        Create new user
        [POST] /user
    */

    async createNewUser(req, res) {
        try {
            // validate
            const { error, value } = createUserValidate(req.body);
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

            // check exists username
            const findUsername = await UserModel.findOne({
                username: value.username,
            });
            if (findUsername)
                return res
                    .status(400)
                    .json(
                        ResponseMessage.create(false, {}, "Username is exists")
                    );

            // check exists email
            const findEmail = await UserModel.findOne({ email: value.email });
            if (findEmail)
                return res
                    .status(400)
                    .json(ResponseMessage.create(false, {}, "Email is exist"));

            // check password vs password confirm
            if (value.password !== value.password_confirm)
                return res
                    .status(400)
                    .json(
                        ResponseMessage.create(
                            false,
                            {},
                            "Password confirm is not correct"
                        )
                    );

            // hash password
            const salt = bcrypt.genSaltSync(Number(saltRounds));
            const password = bcrypt.hashSync(value.password, salt);

            // save user
            const newUser = new UserModel(value);
            newUser.password = password;
            const saveUser = await newUser.save();

            // return client
            res.status(200).json(
                ResponseMessage.create(true, {
                    username: saveUser.username,
                    slug: saveUser.slug,
                })
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
        Update user info
        [PUT] /user/profile
    */
    async updateUserInfo(req, res) {
        try {
            const { id: user_id, slug: slug_user } = res.locals.decoded;
            const { error, value } = updateUserValidate(req.body);
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

            // find user
            const findUser = await UserModel.findById(user_id);
            if (!findUser)
                res.status(404).json(
                    ResponseMessage.create(false, {}, "User is not exist")
                );

            // check email
            if (value.email && value.email !== findUser.email) {
                // check exists email
                const findEmail = await UserModel.findOne({
                    email: value.email,
                });
                if (findEmail)
                    return res
                        .status(400)
                        .json(
                            ResponseMessage.create(false, {}, "Email is exist")
                        );
            }

            // save update user info
            const updateUser = await UserModel.findByIdAndUpdate(
                user_id,
                { ...value, updated: Date.now() },
                { new: true }
            )
                .select("-_id -__v -password")
                .populate("avatar");

            const { username, slug, name, email, avatar } = updateUser;
            res.status(200).json(
                ResponseMessage.create(true, {
                    username,
                    slug,
                    name,
                    email,
                    avatar: avatar?.filename,
                })
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
        Change password user
        [PUT] /user/change_password
    */
    async changePasswordUser(req, res) {
        try {
            const { id: user_id, slug: slug_user } = res.locals.decoded;
            // validate data update
            const { error, value } = validateChangePassword(req.body);
            if (error)
                return res
                    .status(400)
                    .send(
                        ResponseMessage.create(
                            false,
                            {},
                            error.details[0].message
                        )
                    );

            // find user
            const findUser = await UserModel.findById(user_id);
            if (!findUser)
                res.status(404).json(
                    ResponseMessage.create(false, {}, "User is not exist")
                );

            // check current password
            const checkPassword = bcrypt.compareSync(
                value.current_password,
                findUser.password
            );
            if (!checkPassword)
                return res
                    .status(400)
                    .send(
                        ResponseMessage.create(
                            false,
                            {},
                            "Current password is not correct"
                        )
                    );

            // check password vs password confirm
            if (value.new_password !== value.confirm_password)
                return res
                    .status(400)
                    .json(
                        ResponseMessage.create(
                            false,
                            {},
                            "Password confirm is not correct"
                        )
                    );

            // hash new password
            const salt = bcrypt.genSaltSync(Number(saltRounds));
            const password = bcrypt.hashSync(value.new_password, salt);

            // save update password
            await UserModel.findByIdAndUpdate(user_id, {
                password,
                updated: Date.now(),
            });
            res.status(200).json(
                ResponseMessage.create(true, {}, "Update success")
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
        Change avatar user
        [PUT] /user/change_avatar
    */
    changeUserAvatar(req, res) {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError)
                return res
                    .status(401)
                    .json({ error: { message: err }, success: false });
            if (err)
                return res
                    .status(400)
                    .json(
                        ResponseMessage.create(
                            false,
                            {},
                            "An error occurred when uploading image"
                        )
                    );

            if (req.file === undefined)
                return res
                    .status(400)
                    .json(
                        ResponseMessage.create(false, {}, "Image is required")
                    );
            // create new image model
            const newImage = new ImageModel();
            newImage.filename = req.file.filename;
            newImage.content_type = req.file.mimetype;
            // save database
            try {
                const saveImage = await newImage.save();
                const { id: user_id } = res.locals.decoded;
                const updateUser = await UserModel.findByIdAndUpdate(
                    user_id,
                    { avatar: saveImage._id },
                    { new: true }
                );
                res.status(200).json(
                    ResponseMessage.create(
                        true,
                        {
                            filename: saveImage.filename,
                            content_type: saveImage.content_type,
                        },
                        "Upload avatar success"
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
        });
    }
}

module.exports = new UserController();
