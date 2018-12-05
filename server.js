'use strict';

// app dependiencies
const express = require('express');
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
function Location(data) {
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}
app.get('/location', (req, res) => {
  // console.log('my request object: ', req);
  const locationData = searchToLatLng(req.query.data);
  //the server will send location data to the client
  res.send(locationData);
});

// helper function
function searchToLatLng(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  location.search_query = query;
  return location;
}
// -------------------------WEATHER-------------------------
function Weather(data) {
  this.forecast = data.daily.summary;
  this.time = data.currently.time;
}
app.get('/weather', (req, res) => {
  // console.log('my request object: ', req);
  const weatherData = searchWeather(req.query.data);
  res.send(weatherData);
});
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