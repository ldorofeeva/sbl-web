const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const HopsController = require('../vanilla-controllers/hops-controllers');

// const checkAuth = require('../middleware/check-auth');

router.get('/', HopsController.getAll);

// router.use(checkAuth);

router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('name').isLength({min: 3, max: 120}),
    ],
    HopsController.createNew
);

router.patch(
    '/:pid',
    [
        check('name').not().isEmpty(),
        check('name').isLength({min: 3, max: 120}),
    ],
    HopsController.updateItemByName
);

router.delete('/:pid', HopsController.deleteItemByName);

module.exports = router;