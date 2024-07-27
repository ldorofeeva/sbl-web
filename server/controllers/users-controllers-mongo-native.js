const { validationResult } = require('express-validator');

const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const tokenPKey = `${process.env.JWT_KEY}`;
const MongoClient = require('mongodb').MongoClient;


const url = 'mongodb://mongo0:27018,mongo1:28019,mongo2:27020/mern?replicaSet=dockerrs';

const getAllUsers = async (req, res, next) => {
    console.log('GET All Users');
    const client = new MongoClient(url);
    let allUsers;
    try{
        await client.connect();
        const db = client.db();
        allUsers = await db.collection('users').find().toArray();
    } catch(error) {
        return next(new HttpError('Cant access DB', 404))
    }
    client.close();
    console.log(allUsers);
    res.json(allUsers);
};

const signup = async (req, res, next) => {
    console.log('CREATE User');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }
    const {name, email, password, image, places} = req.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed hashing password', 500))
    }
    const newUser = {
        id: uuid(),
        name,
        email,
        hashedPassword,
        image,
        places
    };

    const client = new MongoClient(url);

    try{
        await client.connect();
        const db = client.db();
        const result = await db.collection('users').insertOne(newUser);
    } catch(error) {
        return next(new HttpError('Cant access DB', 404))
    }
    client.close();
    res.status(200).json({signed_up: newUser});
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422));
    }
    const {email, password} = req.body;
    //const user = DUMMY_USERS.find(u => {return u.email === email});

    let existingUser;
    const client = new MongoClient(url);
    try{
        await client.connect();
        const db = client.db();
        existingUser = await db.collection('users').findOne({email: email});

    } catch (err) {
        return next(new HttpError('Failed verifying user email', 500))
    }
    if (!existingUser || existingUser.length === 0) {
        return next(new HttpError('No user with email ' + email, 404));
    }
    console.log("LOGIN");
    console.log(email);
    console.log(password);
    console.log(existingUser);

    let isValidPassword = false;
    try {
        isValidPassword = bcrypt.compare(password, existingUser.password)
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed verifying password', 500));
    }
    if (!isValidPassword) {
        return next(new HttpError('Wrong password for email ' + email, 403));
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, name: existingUser.name},
            tokenPKey,
            {expiresIn: '1h'}
        );
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating user token', 500))
    }
    res.status(201).json({userId: existingUser.id, name: existingUser.name, token: token});
};

exports.getAllUsers = getAllUsers;

exports.login = login;

exports.signup = signup;