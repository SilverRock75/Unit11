var express = require('express');
var router = express.Router();
var ctrlCourses = require('../controllers/courses');

router.get('/courses', ctrlCourses.courseList);
router.get('/course/:course_id', ctrlCourses.courseInfo);
router.post('/courses/:course_id/assignments', ctrlCourses.addAssignment);
router.get('/courses/:course_id/assignments', ctrlCourses.assignmentList);
router.put('/courses/:course_id/assignments/:assignment_id', ctrlCourses.updateAssignment);
router.delete('/courses/:course_id/assignments/:assignment_id', ctrlCourses.deleteAssignment);

module.exports = router;
