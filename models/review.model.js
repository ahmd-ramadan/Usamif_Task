const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true,
        minLength: [2, 'too short review text']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref:'Course',
        required: true,
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
}, { 
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema)



