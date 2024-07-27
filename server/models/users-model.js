// const mongoose = require('mongoose');
//
//
// const userSchema = new mongoose.Schema({
//         name: { type: String, required: true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true, minlength: 4 },
//         image: { type: String, required: false },
//         places: [{type: mongoose.Types.OjectId, required: true, ref: 'places'}]
// });
// // mongoose.Types.ObjectId
// // Collection name is derived from 'Place' as 'places' - all lowercase and s at the end, if not there yet
// // I can and Will Keep collection names consistent!!!
// module.exports = mongoose.model('users', userSchema);

const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 4 },
    image: { type: String, required: false },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'places'}]
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('users', userSchema);


