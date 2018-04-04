var mongoose = require('mongoose');

var assignmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    due: {
        type: Date,
        required: true,
    },
    points: {
        type: Number,
        "default": 0,
        min: 0,
        max: 100,
    },
    status: String,
});

var courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    instructor: String,
    credits: Number,
    blood: String,
    assignments: [assignmentSchema],
});

var Course = mongoose.model('Course', courseSchema);
