'use strict';

// app dependiencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// get proect enviroment variables
require('dotenv').config();

// app constants
const PORT = process.env.PORT || 3000;
const app = express();

// app middleware
app.use(cors());
// app.use(express.static('./'));

// -------------------------LOCATION-------------------------
//Referencing the data from the json files that will include longitude and latitude
function Location(query, res) {
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng;
  this.search_query = query;
}
app.get('/location', (req, res) => {
  // console.log('my request object: ', req);
  searchToLatLng(req.query.data)
    .then(location => res.send(location))
    .catch(error => handleError(error,res));
});

// helper function
function searchToLatLng(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  location.search_query = query;
  return location;
}
// -------------------------WEATHER-------------------------
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
}
app.get('/weather', getWeather);

// helper function
function searchWeather(query) {
  const weatherData = require('./data/weather.json');
  const weather = new Weather(weatherData);
  weather.search_query = query;
  return weather;
}
// the client will recieve an error message upon status error 500
function handleError(err, res) {
  console.error(err);
  if (res) res.satus(500).send('Sorry, something broke');
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});