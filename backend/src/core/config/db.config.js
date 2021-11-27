const mongoose = require("mongoose");
const connectUrl = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;
// connect database
const connectDb = async () => {
    try {
        await mongoose.connect(connectUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connect database success...");
    } catch (error) {
        console.log("Connect database failed...");
        console.log(error);
    }
};

module.exports = { connectDb };
