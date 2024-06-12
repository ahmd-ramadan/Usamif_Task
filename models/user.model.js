const mongoose = require('mongoose');

const  Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    coursesCreated: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        }
    ],
    favList: [
        { 
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        }
    ],
})

module.exports = mongoose.model('User', userSchema); 