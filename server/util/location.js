const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDntUb9evc2j-yt2ddXvVQAeS2d-Y5oucA';
//
// async function getCoordFromAddr(address) {
//     // Dummy
//     //return {"lat": 40, "lng": -73}
//     const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${
//             encodeURIComponent(address)
//         }&key=${API_KEY}`);
//
//     const data = response.data;
//
//     console.log(data)
//
//     if (!data || data.status === 'ZERO_RESULTS'){
//      throw new HttpError('Could not find location for ' + address, 422)
//     }
//
//     return data.results[0].geometry.location;
// }
//
//
// module.exports = getCoordFromAddr;

async function getCoordsForAddress(address) {
  return {
    lat: 40.7484474,
    lng: -73.9871516
  };
}
//   console.log("Get coords of address")
//   console.log(address)
//   const response = await axios.get(
//     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//       address
//     )}&key=${API_KEY}`
//   );
//
//   const data = response.data;
//   console.log(data)
//
//   if (!data || data.status === 'ZERO_RESULTS') {
//     const error = new HttpError(
//       'Could not find location for the specified address.',
//       422
//     );
//     throw error;
//   }
//
//   const coordinates = data.results[0].geometry.location;
//
//   return coordinates;
// }

module.exports = getCoordsForAddress;