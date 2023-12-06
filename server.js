/* eslint-disable indent */
'use strict';

const dotenv = require('dotenv');

const cors = require('cors');

const express = require('express');

const handleWeather = require('./weather.js');

const handleMovies = require('./movies.js');

const handleEvents = require('./events.js');

const cache = {
    movies: {},
    weather: {},
    events: {},
  };

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.use((req, res, next) => {
    req.cache = cache;
    next();
  });

app.get('/weather', handleWeather);

app.get('/movies', handleMovies);

app.get('/events', handleEvents);

app.listen(PORT, () => {
    console.log('App is listening!!');
  });
