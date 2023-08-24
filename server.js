/* eslint-disable indent */
'use strict';

const dotenv = require('dotenv');

const cors = require('cors');

const express = require('express');

const axios = require('axios');

dotenv.config();
const PORT = process.env.PORT;
const API_KEY = process.env.WEATHER_API_KEY;
const API_KEY_2 = process.env.MOVIE_API_KEY;

const app = express();
app.use(cors());

class Forecast {
    constructor(date, description) {
      this.data = date;
      this.description = description;
    }
}

class Movie {
    constructor(title, overview, average_votes, total_votes, image_url, popularity, released_on) {
        this.title = title;
        this.overview = overview;
        this.average_votes = average_votes;
        this.total_votes = total_votes;
        this.image_url = image_url;
        this.popularity = popularity;
        this.released_on = released_on;
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


app.get('/movies', (request, response) => {
    const city = request.query.city;

    if (!city) {
        response.status(400).send({ error: 'City not provided' });
        return;
    }

    try {
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY_2}&query=${city}`)
            .then(apiResponse => {
                const movieData = apiResponse.data.results.map(movie => {
                    return new Movie(
                        movie.title,
                        movie.overview,
                        movie.vote_average,
                        movie.vote_count,
                        `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                        movie.popularity,
                        movie.release_date
                    );
                });

                response.json(movieData);
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
