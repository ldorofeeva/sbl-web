const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const mongoose = require('mongoose');
const fs = require('fs');

const Place = require('../models/places-model');
const User = require('../models/users-model');

const getAllPlaces = async (req, res, next) => {
    console.log('GET Request in places');
    let places;
    try {
        places = await Place.find().exec(); // exec required for await - real promise
    } catch (err) {
        return next(new HttpError('Failed loading places', 500))
    }
    if (!places) {
        // trow to stop further execution
        return next( new HttpError('No places found', 404));
    }
    res.json(places);
};

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid; // Same name as in get address
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Failed searching place', 500))
    }
    if (!place) {
        // trow to stop further execution
        return next( new HttpError('Could not find a place with ' + placeId, 404));
    }
    res.json({place: place.toObject({getters: true})});
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid; // Same name as in get address

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    } catch (err) {
        return next(new HttpError('Failed searching place', 500))
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        // next to stop further execution
        return next(new HttpError('Could not find a place for user ' + userWithPlaces.name, 404));
    }
    res.json({place: userWithPlaces.places.map(place => place.toObject({getters: true}))});

    // Alternative
    // let userPlaces;
    // try {
    //     userPlaces = await Place.find({creator: userId}).exec();
    // } catch (err) {
    //     return next(new HttpError('Failed searching place', 500))
    // }
    //
    // if (!userPlaces || userPlaces.length === 0) {
    //     // next to stop further execution
    //     return next(new HttpError('Could not find a place for user ' + userId, 404));
    // }
    // res.json({place: userPlaces.map(place => place.toObject({getters: true}))});
};

// Post req with data in the body
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }
    const {title, description, address, image, creator} = req.body;

    console.log(`Getting user by id ${creator}`);

    console.log(req);


    let user;
    try {
        console.log(`Getting user by id ${creator}`);
        user = await User.findById(creator).exec();
    } catch (err) {
        return next(new HttpError('Failed verifying user email', 500))
    }
    if (!user || user.length === 0) {
        return next(new HttpError('No user with id ' + creator, 404));
    }

    const createdPlace = new Place({
        title: title,
        description: description,
        address: address,
        creator: creator,
        image: req.file.path,
    });

    console.log(createdPlace);
    let result;
    try {
        result = await createdPlace.save();
        user.places.push(createdPlace);
        await user.save();
        // On replica set: Do Transaction in a session
        // const session = await mongoose.startSession();
        // session.startTransaction();
        // result = await createdPlace.save({session: session});
        // // user.places.push(createdPlace);
        // // await user.save({session: session});
        // await session.commitTransaction();

    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating new place', 500))
    }
    res.status(201).json({place: result.toObject({getters: true})});
};


const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next( new HttpError('Invalid input', 422));
    }
    const placeId = req.params.pid; // Same name as in get address
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Failed searching place', 500))
    }
    if (!place) {
        // trow to stop further execution
        return next( new HttpError('Could not find a place with ' + placeId, 404));
    }

    if (place.creator.toString() !== req.userData.userId) {
        return next( new HttpError('You are not authorized to edit this place', 401));
    }
    const {title, description} = req.body;
    place.title = title;
    place.description = description;

    let result;
    try {
        result = await place.save();
    } catch (err) {
        return next(new HttpError('Failed creating new place', 500))
    }
    res.status(200).json({place: place.toObject({getters: true})});
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid; // Same name as in get address
    console.log("Deleting " + placeId)
    let place;
    let user;
    try {
        // Thanks to ref in schema we can use populate
        place = await Place.findById(placeId).populate('creator');
        user = await User.findById(place.creator)
    } catch (err) {
        return next(new HttpError('Failed searching place', 500))
    }
    if (!place) {
        // trow to stop further execution
        return next( new HttpError('Could not find a place with ' + placeId, 404));
    }

    try {
        await place.remove();
        user.places.pull(place);
        await user.save();
    } catch (err) {
        return next(new HttpError('Failed removing place', 500))
    }
    const imagePath = place.image;

    fs.unlink(imagePath, (err) => {
      console.log(err)
    });

    res.status(200).json(placeId + ' Deleted!');
};

exports.getAllPlaces = getAllPlaces;

exports.getPlaceById = getPlaceById;

exports.getPlacesByUserId = getPlacesByUserId;

exports.createPlace = createPlace;

exports.deletePlace = deletePlace;

exports.updatePlace = updatePlace;