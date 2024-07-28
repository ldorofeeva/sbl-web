const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const {find, findOne, insertOne, updateOne, deleteOne, aggregate} = require('./mongo')

const collection = 'beers';


const getAll = async (req, res, next) => {
    console.log('GET All ' + collection);
    let result;
    try {
        result = await aggregate(
            collection,
            [{
                $lookup:
                    {
                        from: 'batches',
                        localField: 'name',
                        foreignField: 'beerName',
                        as: 'batches'
                    }
                },
                {
                $project: {
                    _id: 0,
                    batches: {
                        _id: 0,
                    }
                }
            }]
        );
    } catch (err) {
        console.log(err)
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
        result = await findOne(collection, {'name': name}, {projection: {_id: 0}});
    } catch (err) {
        return next(new HttpError('Failed searching ' + collection, 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('Could not find ' + name + ' in ' + collection, 404));
    }

    let batches;
    try {
        batches = await find(
            'batches',
            {'beerName': name},
            {projection:
                    {
                        _id: 0,
                        'id': 1,
                        'size': 1,
                        'date': 1
                    }
            });
    } catch (err) {
        return next(new HttpError('Failed searching ' + collection, 500))
    }
    result.batches = batches
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
        return next(new HttpError('Failed updating one in ' + collection, 500))
    }
    res.status(201).json({added: result});

};

const deleteItemByName = async (req, res, next) => {
    const name = req.params.pid; // Same name as in get address
    console.log('Delete ' + name + ' In ' + collection);

    let result;
    try {
        result = await deleteOne(collection, {'title': name})
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed deleting one in ' + collection, 500))
    }
    res.status(201).json({added: result});

};

exports.getAll = getAll;
exports.getItemByName = getItemByName;
exports.createNew = createNew;
exports.updateItemByName = updateItemByName;
exports.deleteItemByName = deleteItemByName;