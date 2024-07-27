// const mongoose = require('mongoose');
//
//
// const placeSchema = new mongoose.Schema({
//         title: { type: String, required: true },
//         description: { type: String, required: true },
//         image: { type: String, required: false },
//         address: { type: String, required: true },
//         location: {
//             lat: {type: Number, required: true},
//             lng: {type: Number, required: true}
//         },
//         creator: {type: mongoose.Types.OjectId, required: true, ref: 'users'}
// });
//
// // Collection name is derived from 'Place' as 'places' - all lowercase and s at the end, if not there yet
// // I can and Will Keep collection names consistent!!!
// module.exports = mongoose.model('places', placeSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    address: { type: String, required: true },
    creator: { type: String, required: true}
});

module.exports = mongoose.model('places', placeSchema);