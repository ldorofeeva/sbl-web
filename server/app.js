const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

const usersRoutes = require('./routes/users-routes');
const beersRoutes = require('./routes/beers-routes');
const batchesRoutes = require('./routes/batches-routes');
const hopsRoutes = require('./routes/hops-routes');
const maltsRoutes = require('./routes/malts-routes');

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

app.use('/api/users', usersRoutes); 
app.use('/api/beers', beersRoutes); 
app.use('/api/batches', batchesRoutes); 
app.use('/api/hops', hopsRoutes);
app.use('/api/malts', maltsRoutes);

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

app.listen(`${process.env.APP_PORT}`);
