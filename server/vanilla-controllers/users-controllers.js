const { validationResult } = require('express-validator');

const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const {find, findOne, insertOne, deleteOne} = require('./mongo')
const tokenPKey = `${process.env.JWT_KEY}`;

const getAllUsers = async (req, res, next) => {
    console.log('GET All Users 2');
    let allUsers;
    try{
        allUsers = await find('users');
    } catch(error) {
        console.log(error)
        return next(new HttpError('Cant access DB', 404))
    }
    // await deleteOne('users')
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
        password: hashedPassword,
        image,
        places
    };

    try {
        await insertOne('users', newUser)
    } catch(error) {
        return next(new HttpError('Cant access DB', 404))
    }
    res.status(200).json({signed_up: newUser});
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422));
    }
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await findOne('users', {email: email});
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