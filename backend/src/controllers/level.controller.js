const LevelModel = require("../models/level.model");
const LessonModel = require("../models/lesson.model");
const ResponseMessage = require("../utils/ResponseMessage");
const {
    validateLevel,
    validateLesson,
} = require("../utils/validates/level.validate");
class LevelController {
    /**
     * Get all levels
     * @param {*} request
     * @param {*} response
     * [GET] /learn/levels
     */
    async getLevels(request, response) {
        try {
            const levels = await LevelModel.find()
                .sort({ level: 1 })
                .select("name slug");
            if (!levels)
                return response
                    .status(204)
                    .json(ResponseMessage.create(true, {}, "No found data"));
            response.status(200).json(ResponseMessage.create(true, levels));
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
    /**
     * get all lesson of level
     * @param {*} request
     * @param {*} response
     * [GET] /learn/:slug_level
     */
    async getCoursesOfLevel(request, response) {
        try {
            const slug_level = request.params.slug_level;
            const findLevelId = await LevelModel.findOne({
                slug: slug_level,
            }).select("_id");
            if (!findLevelId)
                response
                    .status(404)
                    .json(ResponseMessage.create(false, {}, `Not exist level`));
            let findLessons = await LessonModel.find({ level: findLevelId })
                .populate("level")
                .sort({
                    number: 1,
                });
            findLessons = findLessons.map((item) => {
                return {
                    name: item.name,
                    number: item.number,
                    slug: item.slug,
                    level: item.level?.slug,
                };
            });
            if (!findLessons)
                return response
                    .status(204)
                    .json(ResponseMessage.create(true, {}, "No content"));
            response
                .status(200)
                .json(ResponseMessage.create(true, findLessons));
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
    /**
     * Add new level
     * @param {*} request
     * @param {*} response
     * [POST] /learn/levels
     */
    async addNewLevel(request, response) {
        try {
            const { error, value } = validateLevel(request.body);
            if (error)
                return response
                    .status(400)
                    .json(
                        ResponseMessage.create(
                            false,
                            {},
                            error.details[0].message
                        )
                    );
            const findName = await LevelModel.findOne({
                name: request.body.name,
            });
            if (findName)
                return response
                    .status(400)
                    .json(ResponseMessage.create(false, {}, "Level is exist"));
            const maxLevel = await LevelModel.countDocuments();
            const newLevel = new LevelModel(value);
            newLevel.number = maxLevel + 1;
            await newLevel.save();
            response.status(201).json(ResponseMessage.create(true, {}));
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
    /**
     * add new lessson
     * @param {*} request
     * @param {*} response
     * [POST]  /learn/:slug_level
     */
    async addNewLesson(request, response) {
        try {
            const slug_level = request.params.slug_level;
            const findLevelId = await LevelModel.findOne({
                slug: slug_level,
            }).select("_id");
            if (!findLevelId)
                response
                    .status(404)
                    .json(ResponseMessage.create(false, {}, `Not exist level`));
            const { error, value } = validateLesson(request.body);
            if (error)
                return response
                    .status(400)
                    .json(
                        ResponseMessage.create(
                            false,
                            {},
                            error.details[0].message
                        )
                    );
            const findName = await LessonModel.findOne({
                name: request.body.name,
            });
            if (findName)
                response
                    .status(400)
                    .json(ResponseMessage.create(false, {}, "Exist lesson"));
            const maxLesson = await LessonModel.countDocuments({
                level: findLevelId._id,
            });
            const newLesson = new LessonModel(request.body);
            newLesson.number = maxLesson + 1;
            newLesson.level = findLevelId;
            await newLesson.save();
            response.status(201).json(ResponseMessage.create(true, {}));
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
}
module.exports = new LevelController();
