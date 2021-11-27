// config process env
require('dotenv').config({path: __dirname +  "/.env"});
const express = require('express');
const app = express();
const port = process.env.PORT || 2709;
let { connectDb } = require('./core/config/db.config');
const { router } = require('./routers/index.router');
const { middlewares } = require('./utils/middlewares');
const cors = require('cors');

// config middleware
app.use(cors());
app.use(express.json());
middlewares(app);


// connect database and create grid stream
connectDb();

// config router
router(app);

// start app
app.listen(port, () => console.log(`Server is listening at ${port}...`));