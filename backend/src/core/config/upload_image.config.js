const multer = require("multer");
const path = require("path");
const { randomBytes } = require("crypto");
const { MulterError } = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const error =
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
                ? null
                : new MulterError(
                      400,
                      "Only .png, .jpg and .jpeg format allowed!"
                  );
        callback(error, "./src/public/images/");
    },
    filename: async function (req, file, callback) {
        const buf = await randomBytes(24);
        callback(null, buf.toString("hex") + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage }).single("image");

module.exports = { upload };
