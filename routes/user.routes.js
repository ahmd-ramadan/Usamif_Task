const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');
const isAuthenticated = require('../middlewares/authentication.middleware');

router.route('/signup')
    .post(userCtrl.signup);

router.route('/login')
    .post(userCtrl.login);

router.route('/favList')
    .get(isAuthenticated, userCtrl.favList);

router.route('/activate/:token')
    .get(userCtrl.activate);

module.exports = router;