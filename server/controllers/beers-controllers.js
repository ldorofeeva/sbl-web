const {validationResult} = require('express-validator');

const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://mongo0:27018,mongo1:28019,mongo2:27020/mern?replicaSet=dockerrs';

const getAllBeers = async (req, res, next) => {
    console.log('GET All Users');
    const client = new MongoClient(url);
    let allUsers;
    try {
        await client.connect();
        const db = client.db();
        allUsers = await db.collection('users').find().toArray();
    } catch (error) {
        return next(new HttpError('Cant access DB', 404))
    }
    client.close();
    console.log(allUsers);
    res.json(allUsers);
};


const createNewBeer = async (req, res, next) => {
    console.log('CREATE Beer');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }
    const {name, image, batches} = req.body;

    const newBeer = {
        id: uuid(),
        name,
        image,
        batches
    };

    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db();
    } catch (error) {
        return next(new HttpError('Cant access DB', 404))
    }
    let existingBeer;
    try {
        existingBeer = await db.collection('beers').findOne({name: name});
    } catch (error) {
        return next(new HttpError('Cant access DB', 404))
    }
    if (existingBeer) {
        return next(new HttpError('Beer with name ' + name + ' already exists', 404));
    }
    client.close();
    res.status(200).json({added: newBeer});
};

exports.getAllBeers = getAllBeers;
exports.createNewBeer = createNewBeer