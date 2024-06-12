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
    .get(isAuthenticate, courseCtrl.like)

router.route('/review/:courseId')
    .post(isAuthenticate, courseCtrl.review)

router.route('/:courseId')
    .get(courseCtrl.getCourseById)



module.exports = router;