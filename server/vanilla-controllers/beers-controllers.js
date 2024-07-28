const HttpError = require('../models/http-error');
const {find, findOne, aggregate} = require('./mongo')
const {deleteOneController, createNewController, updateOneController} = require('./simple-reusable-controllers')


const getAll = async (req, res, next) => {
    console.log('GET All ' + 'beers');
    let result;
    try {
        result = await aggregate(
            'beers',
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
        return next(new HttpError('Failed loading beers', 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('No beers found', 404));
    }
    res.json(result);
};

const getItemByName = async (req, res, next) => {
    const name = req.params.pid; // Same name as in get address
    let result;
    console.log("Get one by name " + name)
    try {
        result = await findOne('beers', {'name': name}, {projection: {_id: 0}});
    } catch (err) {
        return next(new HttpError('Failed searching beers', 500))
    }
    if (!result) {
        // trow to stop further execution
        return next(new HttpError('Could not find ' + name + ' in beers', 404));
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
        return next(new HttpError('Failed searching ' + 'beers', 500))
    }
    result.batches = batches
    res.json({result: result});
};

const createNew = async (req, res, next) => {
    return await createNewController('beers', req, res, next)
};

const updateItemByName = async (req, res, next) => {
    return await updateOneController('beers', 'name', req, res, next)
};

const deleteItemByName = async (req, res, next) => {
    return await deleteOneController('beers', 'name', req, res, next)
};

exports.getAll = getAll;
exports.getItemByName = getItemByName;
exports.createNew = createNew;
exports.updateItemByName = updateItemByName;
exports.deleteItemByName = deleteItemByName;