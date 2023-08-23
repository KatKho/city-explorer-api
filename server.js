/* eslint-disable indent */
'use strict';

const dotenv = require('dotenv');

const cors = require('cors');

const express = require('express');

const weatherData = require('./data/weather.json');

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());

class Forecast {
    constructor(date, description) {
      this.data = date;
      this.description = description;
    }
  }

  function handleApiError(response, error) {
    console.error('API Error:', error);

    if (error.response) {
        response.status(error.response.status).send(error.response.data);
    } else {
        response.status(500).send('Internal server error');
    }
}

app.get('/weather', (request, response) => {
    const searchQuery = request.query.searchQuery;

    try {
        const foundCity = weatherData.find(city => {
            return (
                city.city_name.toLowerCase() === searchQuery.toLowerCase()
            );
        });

        if (!foundCity) {
            response.status(404).send({ error: 'City not found' });
            return;
        }

        const forecasts = foundCity.data.map(forecastData => {
            return new Forecast(
                forecastData.valid_date,
                forecastData.weather.description,
            );
        });

        response.send({
            city: foundCity.city_name,
            lat: foundCity.lat,
            lon: foundCity.lon,
            forecasts: forecasts,
        });
    } catch (error) {
        handleApiError(response, error);
    }
});

app.listen(PORT, () => {
    console.log('App is listening!!');
  });
