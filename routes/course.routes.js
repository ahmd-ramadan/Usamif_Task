const express = require('express');
const router = express.Router();

const courseCtrl = require('../controllers/course.controller');
const isAuthenticate = require('../middlewares/authentication.middleware');

router.route('/create')
    .post(isAuthenticate, courseCtrl.createCourse)

router.route('/list')
    .get(courseCtrl.list)

router.route('/recent')
    .get(courseCtrl.recent);

router.route('/recommend')
    .get(isAuthenticate, courseCtrl.recommendCources)

router.route('/like/:courseId')
    .post(isAuthenticate, courseCtrl.like)

router.route('/:courseId')
    .get(courseCtrl.getCourseById)
    .post(isAuthenticate, courseCtrl.review)



module.exports = router;