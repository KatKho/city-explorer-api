/* eslint-disable indent */
'use strict';

const dotenv = require('dotenv');

const cors = require('cors');

const express = require('express');

const handleWeather = require('./weather.js');

const handleMovies = require('./movies.js');

const cache = {};

dotenv.config();
const PORT = process.env.PORT || 5173;

const app = express();
app.use(cors());

app.use((req, res, next) => {
    req.cache = cache;
    next();
  });

app.get('/weather', handleWeather);

app.get('/movies', handleMovies);

app.listen(PORT, () => {
    console.log('App is listening!!');
  });
