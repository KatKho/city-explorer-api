/* eslint-disable indent */
'use strict';

const dotenv = require('dotenv');

const cors = require('cors');

const express = require('express');

const axios = require('axios');

dotenv.config();
const PORT = process.env.PORT;
const API_KEY = process.env.WEATHER_API_KEY;

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
    const lat = parseFloat(request.query.lat);
    const lon = parseFloat(request.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
        response.status(400).send({ error: 'Invalid latitude, longitude, or city' });
        return;
    }

    try {

        axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?key=${API_KEY}&lat=${lat}&lon=${lon}`)
            .then(apiResponse => {
                const weatherForecasts = apiResponse.data.data.map(forecastData => {
                    return new Forecast(
                        forecastData.valid_date,
                        forecastData.weather.description,
                    );
                });

                response.json({
                    lat: lat,
                    lon: lon,
                    forecasts: weatherForecasts,
                });
            })
            .catch(apiError => {
                handleApiError(response, apiError);
            });

    } catch (error) {
        handleApiError(response, error);
    }
});

app.listen(PORT, () => {
    console.log('App is listening!!');
  });
