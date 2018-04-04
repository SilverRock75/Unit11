var express = require('express');
var router = express.Router();
var ctrlCourses = require('../controllers/courses');

router.get('/', ctrlCourses.courseList);
router.get('/course/:course_id', ctrlCourses.courseInfo);
router.get('/course/:course_id/assignments/new', ctrlCourses.addAssignment);
router.post('/course/:course_id/assignments/new', ctrlCourses.doAddAssignment);

router.get('/course/:course_id/assignments/:assignment_id', ctrlCourses.editAssignment);
router.post('/course/:course_id/assignments/:assignment_id', ctrlCourses.doEditAssignment);
router.get('/course/:course_id/assignments/:assignment_id/delete', ctrlCourses.deleteAssignment);

module.exports = router;
