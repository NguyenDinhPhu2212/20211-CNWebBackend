const LessonModel = require("../models/lesson.model");
const AnswerModel = require("../models/answer.model");
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
        const otherAnswer = await AnswerModel.find({
            _id: { $ne: id },
        }).populate("image");
        const one = Math.floor(Math.random() * otherAnswer.length);
        mapQuestion.push({
            content: otherAnswer[one].content,
            image: otherAnswer[one].image?.filename,
            correct: false,
        });
        let two = one + 1;
        if (one == otherAnswer.length - 1) {
            two = one - 1;
        }
        mapQuestion.push({
            content: otherAnswer[two].content,
            image: otherAnswer[two].image?.filename,
            correct: false,
        });
        mix(mapQuestion);
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
            let correctAnswer = await AnswerModel.find({
                question: findQuestion._id,
            })
                .select("-__v -question")
                .populate("image");
            correctAnswer = correctAnswer.map((answer) => {
                return {
                    ...{ ...answer }._doc,
                    image: answer.image?.filename,
                    correct: true,
                };
            });
            if (findQuestion.type == "vi") {
                await getOtherAnswer(correctAnswer[0]._id, correctAnswer);
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
                const newAnswer = new AnswerModel(answer);
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
