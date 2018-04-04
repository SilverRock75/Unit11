var request = require('request');

var apiOptions = {
    server: 'http://localhost:3000'
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://thawing-garden-84290.herokuapp.com/';
}

var renderHomepage = function(req, res, responseBody) {
    var message;

    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No courses found";
        }
    }

    res.render('courses-list', {
        title: 'Thawing Garden - For when you are about to blossom',
        pageHeader: {
            title: 'Course Horse',
            strapline: 'You may have been dormant, but now you can blossom!',
        },
        courses: responseBody,
        message: message,
    });
}

var renderDetailPage = function(req, res, courseDetail) {
    res.render('course-info', {
        title: courseDetail.title,
        pageHeader: {
            title: courseDetail.title,
        },
        course: courseDetail,
    });
}

var renderAssignmentForm = function(req, res, courseDetail) {
    let assign = null;
    if (req.params.assignment_id) {
        for (let a of courseDetail.assignments) {
          if (a._id == req.params.assignment_id) {
            assign = a;
          }
        }
    }

    res.render('add-edit-assignment', {
        title: 'Add/edit an assignment for ' + courseDetail.title,
        pageHeader: {
            title: 'Add/edit an assignment for ' + courseDetail.title,
        },
        error: req.query.err,
        statuses: [
            'Not even on my radar',
            'Due date sounds vaguely soon',
            'It would be wise to start working on this',
            'I still have a couple more days',
            'Due tomorrow? Do tomorrow.',
            'Hastily submitted',
        ],
        assignment: assign,
    });
}

var getCourseInfo = function(req, res, callback) {
    var requestOptions, path;

    path = '/api/course/' + req.params.course_id;
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
    };

    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                callback(req, res, body);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};



module.exports = {
    addAssignment: function(req, res) {
        getCourseInfo(req, res, renderAssignmentForm);
    },
    editAssignment: function(req, res) {
        getCourseInfo(req, res, renderAssignmentForm);
    },
    doEditAssignment: function(req, res) {
        var requestOptions, path, course_id, assignment_id, postdata;
        course_id = req.params.course_id;
        assignment_id = req.params.assignment_id;
        path = `/api/courses/${course_id}/assignments/${assignment_id}`;

        postdata = {
            name: req.body.name,
            due: req.body.due,
            points: parseInt(req.body.points, 10),
            status: req.body.status,
        };

        requestOptions = {
            url: apiOptions.server + path,
            method: 'PUT',
            json: postdata,
        };

        if (!postdata.name || !postdata.due || !postdata.points) {
            res.redirect(`/course/${course_id}/assignments/${assignment_id}?err=val`);
        } else if (postdata.points < 0 || postdata.points > 100) {
            res.redirect(`/course/${course_id}/assignments/${assignment_id}?err=range`);
        } else {
            request(
                requestOptions,
                function(err, response, body) {
                    if (response.statusCode === 200) {
                        res.redirect('/course/' + course_id);
                    } else if (response.statusCode === 400 && body.name && body.name ===
                               "ValidationError" ) {
                        res.redirect('/course/' + course_id + '/assignments/' + assignment_id + '?err=val');
                    } else {
                        _showError(req, res, response.statusCode);
                    }
                }
            )
        }
    },
    deleteAssignment: function(req, res) {
        var requestOptions, path, course_id, assignment_id;
        course_id = req.params.course_id;
        assignment_id = req.params.assignment_id;
        path = `/api/courses/${course_id}/assignments/${assignment_id}`;

        requestOptions = {
            url: apiOptions.server + path,
            method: 'DELETE',
            json: {},
        };

        request(
          requestOptions,
          function(err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/course/' + course_id);
            } else {
                _showError(req, res, response.statusCode);
            }
          }
        )
    },
    doAddAssignment: function(req, res) {
        var requestOptions, path, course_id, postdata;
        course_id = req.params.course_id;
        path = `/api/courses/${course_id}/assignments`;

        postdata = {
            name: req.body.name,
            due: req.body.due,
            points: parseInt(req.body.points, 10),
            status: req.body.status,
        };

        requestOptions = {
            url: apiOptions.server + path,
            method: 'POST',
            json: postdata,
        };

        if (!postdata.name || !postdata.due || !postdata.points) {
            res.redirect(`/course/${course_id}/assignments/new?err=val`);
        } else if (postdata.points < 0 || postdata.points > 100) {
            res.redirect(`/course/${course_id}/assignments/new?err=range`);
        } else {
            request(
                requestOptions,
                function(err, response, body) {
                    if (response.statusCode === 201) {
                        res.redirect('/course/' + course_id);
                    } else if (response.statusCode === 400 && body.name && body.name ===
                               "ValidationError" ) {
                        res.redirect('/course/' + course_id + '/assignments/new?err=val');
                    } else {
                        _showError(req, res, response.statusCode);
                    }
                }
            )
        }
    },
}

var _showError = function (req, res, status) {
    var title, content;

    if (status === 404) {
        title = "404, page not found";
        content = "Page not found. Sorry, bruh.";
    } else {
        title = status + ", something's gone wrong";
        content = "Something's hecked";
    }

    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content,
    });
};

module.exports.courseInfo = function(req, res) {
    getCourseInfo(req, res, renderDetailPage);
};

module.exports.courseList = function(req, res) {
    var requestOptions, path;

    path = '/api/courses';
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs: {},
    };

    request(
        requestOptions,
        function(err, response, body) {
            renderHomepage(req, res, body);
        }
    );
};
