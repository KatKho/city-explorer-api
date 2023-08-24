/* eslint-disable indent */
'use strict';
//test
const dotenv = require('dotenv');

const cors = require('cors');

const express = require('express');

const handleWeather = require('./weather.js');

const handleMovies = require('./movies.js');

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get('/weather', handleWeather);

app.get('/movies', handleMovies);

app.listen(PORT, () => {
    console.log('App is listening!!');
  });
