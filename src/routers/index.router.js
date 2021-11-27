const UserRouter = require("./user.router");
const ImageRouter = require("./image.router");
const AccountRouter = require("./account.router");
const LearnRouter = require("./learn.router");
const router = (app) => {
    app.use("/user", UserRouter);
    app.use("/", AccountRouter);
    app.use("/image", ImageRouter);
    app.use("/learn", LearnRouter);
};

module.exports = { router };
