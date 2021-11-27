const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { upload } = require("../core/config/upload_image.config");
const ImageModel = require("../models/image.model");

class ImageController {
    /*
        Get image
        [GET] /api/v1/images/image/:image_name
    */
    async getImage(request, response) {
        const image_name = request.params.image_name;
        // check exists database
        const findImage = await ImageModel.findOne({ filename: image_name });
        if (!findImage)
            return response
                .status(404)
                .json({
                    data: {},
                    message: "Image does not exist in the database",
                    success: false,
                });
        const filePath = path.join(__dirname, "../public/images/", image_name);
        const stat = fs.statSync(filePath);
        response.writeHead(200, {
            "Content-Type": findImage.content_type,
            "Content-Length": stat.size,
        });
        const readStream = fs.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(response);
    }

    /*
        Upload image
        [POST] /api/v1/images
    */
    uploadImage(request, response) {
        upload(request, response, async (err) => {
            if (err instanceof multer.MulterError)
                return response
                    .status(401)
                    .json({ error: { message: err }, success: false });
            if (err)
                return response
                    .status(400)
                    .json({
                        data: {},
                        message: "An error occurred when uploading image",
                        success: false,
                    });

            if (request.file === undefined)
                return response
                    .status(400)
                    .json({
                        data: {},
                        message: "Image is required",
                        success: false,
                    });
            // create new image model
            const newImage = new ImageModel();
            newImage.filename = request.file.filename;
            newImage.content_type = request.file.mimetype;
            // save database
            try {
                const saveImage = await newImage.save();
                response
                    .status(200)
                    .json({
                        data: {
                            filename: saveImage.filename,
                            content_type: saveImage.content_type,
                        },
                        message: "Upload image success",
                        success: true,
                    });
            } catch {
                response
                    .status(500)
                    .json({
                        data: {},
                        message: "An error occurred when uploading image",
                        success: false,
                    });
            }
        });
    }
}

module.exports = new ImageController();
