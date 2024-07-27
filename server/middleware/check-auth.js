const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

const tokenPKey = `${process.env.JWT_KEY}`;

module.exports = (req, res, next) => {
    try {
        if (req.method === 'OPTIONS') {
            return next();
        }
        console.log(req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1]; // Authorization: ''Bearer TOKEN'
        if (!token) {
            return next(new HttpError('Authentication failed', 403))
        }
        const decodedToken = jwt.verify(token, tokenPKey);
        // All following middleware will have access to userData
        req.userData = {userId: decodedToken.userId};
        console.log(req.userData.userId);
        next();
    } catch(err){
        console.log(err);
        return next(new HttpError('Authentication failed', 403))
    }
};