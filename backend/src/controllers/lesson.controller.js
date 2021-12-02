const LessonModel = require("../models/lesson.model");
const ViAnswerModel = require("../models/viAnswer.model");
const EnAnswerModel = require("../models/enAnswer.model");
const QuestionModel = require("../models/question.model");
const ResponseMessage = require("../utils/ResponseMessage");
const LevelModel = require("../models/level.model");
const { validateQuestion } = require("../utils/validates/question.validate");
const mongoose = require("mongoose");
const mix = (array) => {
    array.sort(() => Math.random() - 0.5);
};
const getOtherAnswer = async (id, mapQuestion) => {
    try {
        let otherAnswer = await EnAnswerModel.find({
            _id: { $ne: id },
        })
            .select("-__v -question")
            .populate("image")
            .limit(2);
        otherAnswer = otherAnswer.map((answer) => {
            return {
                ...{ ...answer }._doc,
                image: answer.image?.filename,
                correct: false,
            };
        });
        mapQuestion = [...mapQuestion, ...otherAnswer];
        mix(mapQuestion);
        return mapQuestion;
    } catch (error) {
        console.log(error);
    }
};
class LessonController {
    /**
     * Get all question of lesson
     * @param {*} request
     * @param {*} response
     * [GET] /learn/:slug_level/:slug_lesson/:number
     */
    async getQuestion(request, response) {
        try {
            const slug_level = request.params.slug_level;
            const slug_lesson = request.params.slug_lesson;
            const number = request.params.number;
            const findLevel = await LevelModel.findOne({ slug: slug_level });
            if (!findLevel)
                response
                    .status(404)
                    .json(ResponseMessage.create(false, {}, "Not found level"));
            const findLesson = await LessonModel.findOne({ slug: slug_lesson });
            if (!findLesson)
                response
                    .status(404)
                    .json(
                        ResponseMessage.create(false, {}, `Not found lesson`)
                    );
            const findQuestion = await QuestionModel.findOne({
                lesson: findLesson._id,
                number: number,
            }).select("_id content type");
            if (!findQuestion)
                response
                    .status(404)
                    .json(
                        ResponseMessage.create(false, {}, "Not found question")
                    );
            const totalQuestions = await QuestionModel.countDocuments({
                lesson: findLesson._id,
            });
            let correctAnswer = [];
            if (findQuestion.type == "vi") {
                correctAnswer = await EnAnswerModel.find({
                    question: findQuestion._id,
                })
                    .select("-__v -question")
                    .populate("image");
            } else {
                correctAnswer = await ViAnswerModel.find({
                    question: findQuestion._id,
                })
                    .select("-__v -question")
                    .populate("image");
            }
            correctAnswer = correctAnswer.map((answer) => {
                return {
                    ...{ ...answer }._doc,
                    image: answer.image?.filename,
                    correct: true,
                };
            });
            if (findQuestion.type == "vi") {
                correctAnswer = await getOtherAnswer(correctAnswer[0]._id, correctAnswer);
            }
            response.status(200).json(
                ResponseMessage.create(true, {
                    question: {
                        content: findQuestion.content,
                        type: findQuestion.type,
                    },
                    answer: correctAnswer,
                    number: number,
                    totalQuestions: totalQuestions,
                })
            );
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
     * Add new question
     * @param {*} request
     * @param {*} response
     * [POST] /learn/:slug_level/:slug_lesson
     */
    async addQuestion(request, response) {
        try {
            const slug_level = request.params.slug_level;
            const slug_lesson = request.params.slug_lesson;
            const findLevel = await LevelModel.findOne({ slug: slug_level });
            if (!findLevel)
                response
                    .status(404)
                    .json(ResponseMessage.create(false, {}, "Not found level"));
            const findLesson = await LessonModel.findOne({ slug: slug_lesson });
            if (!findLesson)
                response
                    .status(404)
                    .json(
                        ResponseMessage.create(false, {}, `Not found lesson`)
                    );
            const { error, value } = validateQuestion(request.body);
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
            const findQuestion = await QuestionModel.findOne({
                content: value.question.content,
            });
            if (findQuestion)
                return response
                    .status(400)
                    .json(ResponseMessage.create(false, {}, "Exist question"));
            const countQuestion = await QuestionModel.countDocuments({
                lesson: findLesson._id,
            });
            const newQuestion = new QuestionModel(request.body.question);
            newQuestion.lesson = findLesson._id;
            newQuestion.number = countQuestion + 1;
            await newQuestion.save();
            request.body.answer.forEach(async (answer) => {
                let newAnswer;
                if (newQuestion.type == "vi") {
                    newAnswer = new EnAnswerModel(answer);
                } else {
                    newAnswer = new ViAnswerModel(answer);
                }
                newAnswer.question = newQuestion._id;
                await newAnswer.save();
            });
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
}
module.exports = new LessonController();
