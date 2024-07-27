const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const {find, findOne, insertOne, updateOne, deleteOne} = require('./mongo')

const collection = 'beers';

const getAll = async (req, res, next) => {
    console.log('GET All ' + collection);
    let result;
    try {
        result = await find(collection); // exec required for await - real promise
    } catch (err) {
        return next(new HttpError('Failed loading ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('No ' + collection + ' found', 404));
    }
    res.json(result);
};

const getItemByName = async (req, res, next) => {
    const name = req.params.pid; // Same name as in get address
    let result;
    console.log("Get one by name " + name)
    try {
        result = await findOne(collection, {'name': name});
    } catch (err) {
        return next(new HttpError('Failed searching ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('Could not find ' + name + ' in ' + collection, 404));
    }
    res.json({result: result});
};

const createNew = async (req, res, next) => {
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

const updateItemByName = async (req, res, next) => {
    const name = req.params.pid; // Same name as in get address
    console.log('Update ' + name + ' In ' + collection);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }

    let result;
    try {
        result = await updateOne(collection, {'name': name}, {'$set': req.body})
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating new in ' + collection, 500))
    }
    res.status(201).json({added: result});

};

exports.getAll = getAll;
exports.createNew = createNew;
exports.updateItemByName = updateItemByName;
exports.getItemByName = getItemByName;