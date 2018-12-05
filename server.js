"use strict";

// app dependiencies
const express = require("express");
const superagent = require("superagent");
const cors = require("cors");

// get proect enviroment variables
require("dotenv").config();

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
app.get("/location", (req, res) => {
  // console.log('my request object: ', req);
  searchToLatLng(req.query.data)
    .then(location => res.send(location))
    .catch(error => handleError(error, res));
});

// helper function
function searchToLatLng(query) {
  // put url here
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${
    process.env.GEOCODE_API_KEY
  }`;
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
app.get("/weather", getWeather);

// helper function
function getWeather(req, res) {
  const url = `https://api.darksky.net/forecast/${
    process.env.WEATHER_API_KEY
  }/${req.query.data.latitude},${req.query.data.longitude}`;
  superagent
    .get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map(day => {
        return new Weather(day);
      });
      res.send(weatherSummaries);
    })
    .catch(error => handleError(error));
}

// the client will recieve an error message upon status error 500
function handleError(err, res) {
  console.error(err);
  if (res) res.satus(500).send("Sorry, something broke");
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
