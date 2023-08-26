/* eslint-disable indent */
'use strict';


const axios = require('axios');
const API_KEY_2 = process.env.MOVIE_API_KEY;
const cache = {
    movies: {},
};
const CACHE_DURATION = 3600;

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

const handleMovies = async (request, response) => {
    const city = request.query.city;

    if (!city) {
        response.status(400).send({ error: 'City not provided' });
        return;
    }

    const cacheKey = `movies:${city}`; 

    if (cache[cacheKey] && cache[cacheKey].timestamp + CACHE_DURATION > Date.now()) {
        console.log('Using cached data for movies in:', city);
        response.json(cache[cacheKey].data);
        return;
    }

    try {
        const apiResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY_2}&query=${city}`);
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

        cache[cacheKey] = {
            timestamp: Date.now(),
            data: movieData,
        };

        response.json(movieData);
    } catch (error) {
        handleApiError(response, error);
    }
};

module.exports = handleMovies;
