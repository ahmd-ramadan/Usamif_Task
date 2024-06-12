const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const userRouter = require('./routes/user.routes');
const courseRouter = require('./routes/course.routes');

const status = require('./utils/httpStatusText');

dotenv.config();
const  app = express();

//! Connect to mongo database
const mongodburl = process.env.MONGO_URL;
mongoose.connect(mongodburl)
.then(() => { 
    console.log('mongodb is connected ...')
}).catch((err) => {
    console.log(err.message);
});

//! middlewares (Built-in)
app.use(cors());
app.use(express.json());

//! middlewares (Route Handlers)
app.use(userRouter);
app.use('/courses', courseRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'Error',
        data: 'page not found'
    });
});

//!middleware (custome)
app.use((error, req, res, next) => {
    console.log(req.body.email);
    console.log(error);
    res.status(error.statusCode || 500).json({
        status: error.statusText || status.ERROR,
        code: error.statusCode || 500,
        data: null,
        message: error.message, 
    });
});

//! Listen On Port #
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`app listening on ${PORT} ...`);
});