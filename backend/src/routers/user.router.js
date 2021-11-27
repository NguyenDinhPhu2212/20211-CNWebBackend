const express = require("express");
const userController = require("../controllers/user.controller");
const UserRouter = express.Router({ caseSensitive: true });
UserRouter.get("/profile/:slug_user", userController.getUser);
UserRouter.post("/", userController.createNewUser);
UserRouter.put("/profile", userController.updateUserInfo);
UserRouter.put("/change_password", userController.changePasswordUser);
UserRouter.put("/change_avatar", userController.changeUserAvatar)
module.exports = UserRouter;
