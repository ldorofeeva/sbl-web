const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const MaltsController = require('../vanilla-controllers/malts-controllers');

const checkAuth = require('../middleware/check-auth');

router.get('/', MaltsController.getAll);

router.use(checkAuth);

router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('name').isLength({min: 3, max: 120}),
    ],
    MaltsController.createNew
);

router.patch(
    '/:pid',
    [
        check('name').not().isEmpty(),
        check('name').isLength({min: 3, max: 120}),
    ],
    MaltsController.updateItemByName
);

router.delete('/:pid', MaltsController.deleteItemByName);

module.exports = router;