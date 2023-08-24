/* eslint-disable indent */
'use strict';

const axios = require('axios');
const API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
    constructor(date, description) {
        this.date = date;
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

const handleWeather = async (request, response) => {
    const lat = parseFloat(request.query.lat);
    const lon = parseFloat(request.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
        response.status(400).send({ error: 'Invalid latitude, longitude, or city' });
        return;
    }

    try {
        const apiResponse = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?key=${API_KEY}&lat=${lat}&lon=${lon}`);

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
    } catch (error) {
        handleApiError(response, error);
    }
};

module.exports = handleWeather;
