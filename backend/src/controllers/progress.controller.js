const ProgressModel = require("../models/progress.model");
const ResponseMessage = require("../utils/ResponseMessage");
const UserModel = require("../models/user.model");
const LevelModel = require("../models/level.model");
const LessonModel = require("../models/lesson.model");
class ProgressController {
    /**
     * Get progress of user
     * @param {*} request
     * @param {*} response
     * [GET] /progress/:slug_user
     */
    async getProgress(request, response) {
        try {
            const slug_user = request.params.slug_user;
            const findUser = await UserModel.findOne({ slug: slug_user });
            if (!findUser)
                response
                    .status(404)
                    .json(
                        ResponseMessage.create(false, {}, "User is not exist")
                    );
            const levels = await LevelModel.find()
                .select("-__v")
                .sort({ number: 1 });
            const progressMap = await Promise.all(
                levels.map(async (level) => {
                    const tmp = { ...level }._doc;
                    let completed = await ProgressModel.find({
                        user: findUser._id,
                        level: level._id,
                    }).populate({
                        path: "lesson",
                        select: "-_id -__v name number",
                        model: LessonModel,
                    });
                    completed = completed.map((item) => item.lesson);
                    const all = await LessonModel.countDocuments({
                        level: level._id,
                    });
                    tmp.completedLesson = completed;
                    tmp.completed = completed.length / all;
                    return tmp;
                })
            );
            response
                .status(200)
                .json(ResponseMessage.create(true, { progress: progressMap }));
        } catch (error) {
            response
                .status(500)
                .json(
                    ResponseMessage.create(
                        false,
                        {},
                        "The server has an error",
                        error.message
                    )
                );
        }
    }
    /**
     * add progress of
     * @param {*} request
     * @param {*} response
     * [POST] /progress/:lessonId
     */
    async postProgress(request, response) {
        try {
            const { id: user_id } = response.locals.decoded;
            const lessonId = request.params.lessonId;
            const findLesson = await LessonModel.findOne({ _id: lessonId });
            if (!findLesson)
                response
                    .status(404)
                    .json(
                        ResponseMessage.create(false, {}, "Lesson is not exist")
                    );
            const progress = new ProgressModel();
            progress.user = user_id;
            progress.lesson = lessonId;
            progress.level = findLesson.level;
            progress.complete = true;
            await progress.save();
            response
                .status(201)
                .json(
                    ResponseMessage.create(
                        true,
                        {},
                        `You have completed ${findLesson.name} lesson`
                    )
                );
        } catch (error) {
            response
                .status(500)
                .json(
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
module.exports = new ProgressController();
