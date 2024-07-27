const {validationResult} = require('express-validator');

const ObjectId = require('mongodb').ObjectId;

const HttpError = require('../models/http-error');
const fs = require('fs');

const {find, findOne, insertOne, updateOne, deleteOne} = require('./mongo')

const getAllPlaces = async (req, res, next) => {
    console.log('GET Request in places');
    let places;
    try {
        places = await find('places'); // exec required for await - real promise
    } catch (err) {
        return next(new HttpError('Failed loading places', 500))
    }
    if (!places) {
        // trow to stop further execution
        return next(new HttpError('No places found', 404));
    }
    // await deleteOne('places')
    res.json(places);
};

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid; // Same name as in get address
    let place;
    console.log("get place by id " + placeId )
    try {
        place = await findOne('places', {'_id': ObjectId(placeId)});
    } catch (err) {
        return next(new HttpError('Failed searching place', 500))
    }
    if (!place) {
        // trow to stop further execution
        return next(new HttpError('Could not find a place with ' + placeId, 404));
    }
    res.json({place: place});
};

const getPlacesByUserId = async (req, res, next) => {
    console.log(req.params)
    const userId = req.params.uid; // Same name as in get address

    let userWithPlaces;
    try {
        userWithPlaces = await findOne('users', {'id': userId});
    } catch (err) {
        return next(new HttpError('Failed searching places', 500))
    }

    if (!userWithPlaces) {
        // next to stop further execution
        return next(new HttpError('Could not find a place for user ' + userWithPlaces.name, 404));
    }

    let userPlaces;
    try {
        userPlaces = await find('places', {'creator': userId})
    } catch (err) {
        return next(new HttpError('Failed searching places', 500))
    }
    res.json({
        place: userPlaces.map(place => place)
    })
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
    console.log(req.headers)
    console.log(req.body)
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }

    // const {title, description, beer} = req.body;
    // // console.log(creator)
    // //
    // const createdPlace = {
    //     title: 'hah', description: 'shgdh', beer: 'Bubba Beer'
    // };
    //
    // // console.log(createdPlace);
    let result;
    try {
        result = await insertOne('beers', req.body)
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating new place', 500))
    }
    res.status(201).json({place: result});
};


const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.headers)
    console.log(req.body)
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422));
    }
    const placeId = req.params.pid; // Same name as in get address

    const {title, description} = req.body;
    const place = {
        title,
        description
    }

    let result;
    try {
        result = await updateOne('places', {'_id': ObjectId(placeId)}, {'$set': req.body});
    } catch (err) {
        return next(new HttpError('Failed updating place', 500))
    }
    res.status(200).json({place: result});
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
        return next(new HttpError('Could not find a place with ' + placeId, 404));
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