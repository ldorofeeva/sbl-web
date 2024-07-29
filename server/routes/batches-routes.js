const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const BatchesController = require('../vanilla-controllers/batches-controllers');

// const checkAuth = require('../middleware/check-auth');

router.get('/', BatchesController.getAll);

router.get('/:pid', BatchesController.getItemById);

router.get('/beer/:pid', BatchesController.getItemsByBeerName);

// router.use(checkAuth);

router.post(
    '/',
    [
        check('beerName').not().isEmpty(),
        check('beerName').isLength({min: 3, max: 120}),
    ],
    BatchesController.createNew
);

router.patch(
    '/:pid',
    BatchesController.updateItemById
);

router.delete('/:pid', BatchesController.deleteItemById);

module.exports = router;