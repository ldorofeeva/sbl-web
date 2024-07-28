const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const {find, findOne, insertOne} = require('./mongo')
const {
    findAllController, findManyController, findOneController, deleteOneController, updateOneController
} = require('./simple-reusable-controllers')



const getAll = async (req, res, next) => {
    return await findAllController('batches', req, res, next)
};

const getItemsByBeerName = async (req, res, next) => {
    return await findManyController('batches', 'beerName', req, res, next)
};

const getItemById = async (req, res, next) => {
    return await findOneController('batches', 'id', req, res, next)
};

const createNew = async (req, res, next) => {
    console.log('CREATE In batches');
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
        result = await insertOne('batches', newBatch)
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating new in  batches', 500))
    }
    res.status(201).json({added: result});

};

const updateItemById = async (req, res, next) => {
    return await updateOneController('batches', 'id', req, res, next)

};

const deleteItemById = async (req, res, next) => {
    return await deleteOneController('batches', 'id', req, res, next)
};

exports.getAll = getAll;
exports.getItemById = getItemById;
exports.getItemsByBeerName = getItemsByBeerName;
exports.createNew = createNew;
exports.updateItemById = updateItemById;
exports.deleteItemById = deleteItemById;