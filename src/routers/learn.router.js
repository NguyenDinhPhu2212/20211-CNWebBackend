const express = require("express");
const lessonController = require("../controllers/lesson.controller");
const levelController = require("../controllers/level.controller")
const LearnRouter = express.Router({ caseSensitive: true });
LearnRouter.get("/:slug_level/:slug_lesson/:number", lessonController.getQuestion);
LearnRouter.post("/:slug_level/:slug_lesson", lessonController.addQuestion);
LearnRouter.get("/levels", levelController.getLevels);
LearnRouter.get("/:slug_level", levelController.getCoursesOfLevel);
LearnRouter.post("/levels", levelController.addNewLevel);
LearnRouter.post("/:slug_level", levelController.addNewLesson);
module.exports = LearnRouter;