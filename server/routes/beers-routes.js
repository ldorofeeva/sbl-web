const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const BeersController = require('../vanilla-controllers/beers-controllers');
// const fileUpload = require('../middleware/file-upload');

// const checkAuth = require('../middleware/check-auth');

router.get('/', BeersController.getAll);

router.get('/:pid', BeersController.getItemByName);

// router.use(checkAuth);

router.post(
    '/',
    // fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('name').isLength({min: 3, max: 120}),
    ],
    BeersController.createNew
);

router.patch(
    '/:pid',
    [
        check('name').not().isEmpty(),
        check('name').isLength({min: 3, max: 120}),
    ],
    BeersController.updateItemByName
);

router.delete('/:pid', BeersController.deleteItemByName);

module.exports = router;