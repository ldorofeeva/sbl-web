const {find, findOne, insertOne, updateOne, deleteOne} = require('./mongo')
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');

const findAllController = async(collection, req, res, next) => {
    let result;
    console.log('Find all in ' + collection);
    try {
        result = await find(collection, {}, {projection: {_id: 0}})
    } catch (err) {
        console.log(err)
        return next(new HttpError('Failed loading ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('No ' + collection + ' found', 404));
    }
    res.json(result);
}

const findManyController = async (collection, searchFieldStr, req, res, next) => {
    const searchFieldVal = req.params.pid;
    let result;
    console.log('Find many in ' + collection);
    try {
        result = await find(collection, {[searchFieldStr]: searchFieldVal}, {projection: {_id: 0}})
    } catch (err) {
        console.log(err)
        return next(new HttpError('Failed loading ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('No ' + collection + ' found', 404));
    }
    res.json(result);
}

const findOneController = async (collection, searchFieldStr, req, res, next) => {
    const searchFieldVal = req.params.pid;
    let result;
    console.log('Find one in ' + collection);
    try {
        result = await findOne(collection, {[searchFieldStr]: searchFieldVal}, {projection: {_id: 0}})
    } catch (err) {
        console.log(err)
        return next(new HttpError('Failed loading ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('None found', 404));
    }
    res.json(result);
}

const createNewController = async (collection, req, res, next) => {
    console.log('CREATE In ' + collection);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }
    let result;
    try {
        result = await insertOne(collection, req.body)
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating new in ' + collection, 500))
    }
    res.status(201).json({added: result});

};

const deleteOneController = async (collection, searchFieldStr, req, res, next) => {
    const searchFieldVal = req.params.pid; // Same name as in get address
    console.log('Delete ' + searchFieldVal + ' In ' + collection);

    let result;
    try {
        result = await deleteOne(collection, {[searchFieldStr]: searchFieldVal})
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed deleting one in ' + collection, 500))
    }
    res.status(201).json({added: result});
}

const updateOneController = async(collection, searchFieldStr, req, res, next) => {
    const searchFieldVal = req.params.pid; // Same name as in get address
    console.log('Update ' + searchFieldVal + ' In ' + collection);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }

    let result;
    try {
        result = await updateOne(collection, {[searchFieldStr]: searchFieldVal}, {'$set': req.body})
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed updating one in ' + collection, 500))
    }
    res.status(201).json({added: result});
}

exports.findAllController = findAllController;
exports.findManyController = findManyController;
exports.findOneController = findOneController;
exports.createNewController = createNewController;
exports.deleteOneController = deleteOneController;
exports.updateOneController = updateOneController;