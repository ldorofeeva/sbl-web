const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const User = require('../models/users-model');

const tokenPKey = `${process.env.JWT_KEY}`;

const getAllUsers = async (req, res, next) => {
    console.log('GET All Users');
    let users;
    try {
        users = await User.find({}, '-password').exec(); // exec required for await - real promise
    } catch (err) {
        return next(new HttpError('Failed loading places', 500))
    }
    if (!users) {
        // trow to stop further execution
        return next( new HttpError('No places found', 404));
    }
    res.status(200).json({users: users.map(user => user.toObject({getters: true}))});
};

const signup = async (req, res, next) => {
    console.log('CREATE User');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input', 422))
    }
    const {name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email}).exec();
    } catch (err) {
        return next(new HttpError('Failed verifying user email', 500))
    }
    if (existingUser && existingUser.length !== 0) {
        return next(new HttpError('User with email ' + email + ' already registered', 404));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed hashing password', 500))
    }
    const newUser = new User({
        name: name,
        email: email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });
    let result;
    try {
        result = await newUser.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating new user', 500))
    }

    let token;
    try {
        token = jwt.sign(
            {userId: newUser.id, email: newUser.email},
            tokenPKey,
            {expiresIn: '1h'}
            );
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating user token', 500))
    }
    res.status(201).json({userId: newUser.id, email: newUser.email, token: token});
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
        existingUser = await User.findOne({email: email}).exec();
    } catch (err) {
        return next(new HttpError('Failed verifying user email', 500))
    }
    if (!existingUser || existingUser.length === 0) {
        return next(new HttpError('No user with email ' + email, 404));
    }
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
            {userId: existingUser.id, email: existingUser.email},
            tokenPKey,
            {expiresIn: '1h'}
            );
    } catch (err) {
        console.log(err);
        return next(new HttpError('Failed creating user token', 500))
    }
    res.status(201).json({userId: existingUser.id, email: existingUser.email, token: token});
};

exports.getAllUsers = getAllUsers;

exports.login = login;

exports.signup = signup;