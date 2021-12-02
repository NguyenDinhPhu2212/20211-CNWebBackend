const express = require("express");
const ProgressRouter = express.Router({ caseSensitive: true });
const progressController = require("../controllers/progress.controller");

ProgressRouter.get("/:slug_user", progressController.getProgress);
ProgressRouter.post("/:lesssonId", progressController.postProgress);

module.exports = ProgressRouter;
