const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
            required: true,
        }
    ],
    likes: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ]

},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Course", courseSchema);