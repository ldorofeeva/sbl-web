const express = require('express');

const { check } = require('express-validator');

const router = express.Router();

// const PlacesControllers = require('../controllers/places-controller');
const PlacesControllers = require('../vanilla-controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');

const checkAuth = require('../middleware/check-auth');
// Order matters!
// path is exact match

router.get('/user/:uid', PlacesControllers.getPlacesByUserId);

// router.get('/:pid', PlacesControllers.getPlaceById);

router.get('/', PlacesControllers.getAllPlaces);



router.get('/:pid', PlacesControllers.getPlaceById);

router.use(checkAuth);
router.post(
    '/',
    fileUpload.single('image'),
    [
        check('title').not().isEmpty(),
        check('title').isLength({min: 3, max: 120}),
        check('description').isLength({max: 255}),
        // check('address').not().isEmpty(),
        // check('creator').not().isEmpty()
    ],
    PlacesControllers.createPlace
);

router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('title').isLength({min: 3, max: 120}),
        check('description').isLength({max: 255}),
    ],
    PlacesControllers.updatePlace
);

router.delete('/:pid', PlacesControllers.deletePlace);

module.exports = router;