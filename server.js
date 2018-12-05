/* eslint-disable no-undef */
'use strict';

// app dependiencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// get proect enviroment variables
require('dotenv').config();

// app constants
const PORT = process.env.PORT;
const app = express();

// app middleware
app.use(cors());
// app.use(express.static('./'));

// -------------------------LOCATION-------------------------
//Referencing the data from the json files that will include longitude and latitude
function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng;
}
app.get('/location', (req, res) => {
  // console.log('my request object: ', req);
  searchToLatLng(req.query.data)
    .then(location => res.send(location))
    .catch(error => handleError(error, res));
});

// helper function
function searchToLatLng(query) {
  // put url here
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=seattle&key=AIzaSyAW9SrPliM05Tb1JqVffpSML_LeutUVyAQ`;
  return superagent
    .get(url)
    .then(res => {
      return new Location(query, res);
    })
    .catch(error => handleError(error));
}

// -------------------------WEATHER-------------------------
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
}
app.get('/weather', getWeather);

// helper function
function getWeather(req, res) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${req.query.data.latitude},${req.query.data.longitude}`;
  superagent.get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map(day => {
        return new Weather(day);
      });
      res.send(weatherSummaries);
    })
    .catch(error => handleError(error));
}

// // the client will recieve an error message upon status error 500
function handleError(err, res) {
  console.error(err);
  if (res) res.satus(500).send('Sorry, something broke');
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

// -------------------------YELP-------------------------
// function Review(value) {
//   this.name = value.name;
//   this.price = value.price;
//   this.rating = value.rating;
// }
// app.get('/yelp', getReview);

// // helper function
// function getReview(req, res) {
//   const url = `https://api.yelp.com/v3/businesses/search?location=${request.query.data.latitude},${request.query.data.longitude}`;
//   superagent.get(url)
//     .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
//     .then(result => {
//       const reviewSummaries = result.body.business.map(value => {
//         return new Review(value);
//       });
//       res.send(reviewSummaries);
//     })
//     .catch(error => handleError(error, res));
// }

// // the client will recieve an error message upon status error 500
// function handleError(err, res) {
//   console.error(err);
//   if (res) res.satus(500).send('Sorry, something broke');
// }

// app.listen(PORT, () => {
//   console.log(`listening on ${PORT}`);
// });
