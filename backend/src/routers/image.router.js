const express = require('express');
const ImageRouter = express.Router({caseSensitive: true});
const imageController = require('../controllers/image.controller');

ImageRouter.get('/:image_name', imageController.getImage);
ImageRouter.post('/', imageController.uploadImage);

module.exports = ImageRouter;