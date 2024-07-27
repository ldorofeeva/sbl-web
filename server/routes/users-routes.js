const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const UsersController = require('../vanilla-controllers/users-controllers');
// const UsersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

router.get('/', UsersController.getAllUsers);

router.post(
    '/login',
    [
        check('email').normalizeEmail().isEmail().isLength({min: 6}),
        check('password').not().isEmpty(),
    ],
    UsersController.login
);

router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('email').normalizeEmail().isEmail().isLength({min: 6}),
        check('password').not().isEmpty(),
        check('name').not().isEmpty(),
    ],
    UsersController.signup
);

module.exports = router;