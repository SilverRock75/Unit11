var mongoose = require('mongoose');
var Course = mongoose.model('Course');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var getCourseByReq = function(req, callback) {
    Course.findById(req.params.course_id)
        .exec(function(err, course) {
            callback(course);
        });
}

module.exports = {
    courseInfo: function(req, res) {
        getCourseByReq(req, function(course) {
            if (course) {
                sendJsonResponse(res, 200, course);
            } else {
                sendJsonResponse(res, 404, {
                    message: `Could not find course with id ${req.params.course_id}`,
                });
            }
        });
    },
    courseList: function(req, res) {
        Course.find({}, function(err, courses) {
            sendJsonResponse(res, 200, courses);
        })
    },
    addAssignment: function(req, res) {
        getCourseByReq(req, function(course) {
            course.assignments.push({
                name: req.body.name,
                due: req.body.due,
                points: req.body.points,
                status: req.body.status,
            });

            course.save(function(err) {
                if (err) {
                    console.log(err);
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 201, {status: 'success'});
                }
            });
        });
    },
    assignmentList: function(req, res) {
        getCourseByReq(req, course => sendJsonResponse(res, 200, course.assignments));
    },
    updateAssignment: function(req, res) {
        getCourseByReq(req, function(course) {
            let assign = course.assignments.id(req.params.assignment_id);
            assign.name = req.body.name;
            assign.due = req.body.due;
            assign.points = req.body.points;
            assign.status = req.body.status;

            course.save(function(err) {
                if (err) {
                    console.log(err.message);
                    sendJsonResponse(res, 400, {status: 'failed'});
                    return;
                }
                sendJsonResponse(res, 200, assign);
            });
        });
    },
    deleteAssignment: function(req, res) {
        getCourseByReq(req, function(course) {
            let assign_id = req.params.assignment_id;
            if (assign_id) {
                let assign = course.assignments.id(assign_id).remove();

                course.save(function(err) {
                    if (err) {
                        console.log(err.message);
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                });
            } else {
                sendJsonResponse(res, 404, {message: "No assignment id"});
            }
        });
    },
}
