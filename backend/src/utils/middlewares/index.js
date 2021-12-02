const { checkTokenMiddle } = require("./middleware");

const middlewares = (app) => {
    app.post("/logout", checkTokenMiddle);

    app.get("/user/profile/:slug_user", checkTokenMiddle);
    app.put("/user/profile", checkTokenMiddle);
    app.put("/user/change_avatar", checkTokenMiddle);
    app.put("/user/change_password", checkTokenMiddle);
    app.use("/learn", checkTokenMiddle);
    app.use("/progress", checkTokenMiddle);
};

module.exports = { middlewares };
