const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const {find, findOne, insertOne, updateOne, deleteOne} = require('./mongo')

const collection = 'batches';


const getAll = async (req, res, next) => {
    console.log('GET All ' + collection);
    let result;
    try {
        result = await find(collection, {}, {projection: {_id: 0}}); // exec required for await - real promise
    } catch (err) {
        return next(new HttpError('Failed loading ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('No ' + collection + ' found', 404));
    }
    res.json(result);
};

const getItemsByBeerName = async (req, res, next) => {
    const beerName = req.params.pid; // Same name as in get address
    let result;
    console.log("Get one batch by id " + beerName)
    try {
        result = await find(collection, {'beerName': beerName}, {projection: {_id: 0}});
    } catch (err) {
        return next(new HttpError('Failed searching ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('Could not find ' + beerName + ' in ' + collection, 404));
    }
    res.json({result: result});
};

const getItemById = async (req, res, next) => {
    const id = req.params.pid; // Same name as in get address
    let result;
    console.log("Get one batch by id " + id)
    try {
        result = await findOne(collection, {'id': id}, {projection: {_id: 0}});
    } catch (err) {
        return next(new HttpError('Failed searching ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('Could not find ' + id + ' in ' + collection, 404));
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
    const {beerName} = req.body
    let beer;
    try {
        beer = await findOne('beers', {'name': beerName})
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed searching beer for batch by name ' + beerName, 500))
    }
    if (!beer) {
        // trow to stop further execution
        return next(new HttpError('Could not find a beer ' + beerName, 404));
    }
    let batches;
    let batchNumber = 1;
    try {
        batches = await find('batches', {'beerName': beerName})
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed searching beer for batch by name ' + beerName, 500))
    }
    if (batches) {
        batchNumber = 1 + batches.length;
    }


    const newBatch = req.body
    newBatch.id = `${beerName}_${batchNumber}`
    newBatch.number = batchNumber
    let result;
    try {
        result = await insertOne(collection, newBatch)
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating new in ' + collection, 500))
    }
    res.status(201).json({added: result});

};

const updateItemById = async (req, res, next) => {
    const id = req.params.pid; // Same name as in get address
    console.log('Update ' + id + ' In ' + collection);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }

    let result;
    try {
        result = await updateOne(collection, {'id': id}, {'$set': req.body})
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed updating one in ' + collection, 500))
    }
    res.status(201).json({added: result});

};

const deleteItemById = async (req, res, next) => {
    const id = req.params.pid; // Same name as in get address
    console.log('Delete ' + id + ' In ' + collection);

    let result;
    try {
        result = await deleteOne(collection, {'id': id})
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed deleting one in ' + collection, 500))
    }
    res.status(201).json({added: result});

};

exports.getAll = getAll;
exports.getItemById = getItemById;
exports.getItemsByBeerName = getItemsByBeerName;
exports.createNew = createNew;
exports.updateItemById = updateItemById;
exports.deleteItemById = deleteItemById;