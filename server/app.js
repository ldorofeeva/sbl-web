const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next)=>{
  res.set("Access-Control-Allow-Origin", "*");
  res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
  res.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE");
  next();
});

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes); // => /api/users...

app.use((req, res, next) => {
  throw new HttpError('Could not find this route.', 404);
});
// Middleware function with 4 params is treated by express as a special middleware function - error handling
// only executed on erroneous requests
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err)
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || 'An unknown error occurred'})
});


// const url = `mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}`;
const url = 'mongodb://mongo0:27017/sbl';
console.log(url);

mongoose.connect(url).then(() => {
  app.listen(`${process.env.APP_PORT}`);
  console.log('Connected to DB via Mongooooooose')
}).catch(() => {
  console.log('Connect failed')
});