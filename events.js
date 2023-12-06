'use strict';

const axios = require('axios');
const YELP_API_KEY = process.env.YELP_API_KEY;
const cache = {};
const CACHE_DURATION = 3600 * 1000; 

class Event {
  constructor(
    description,
    image_url,
    name,
    event_site_url,
    latitude,
    longitude,
    time_end,
    time_start
  ) {
    this.description = description;
    this.image_url = image_url;
    this.name = name;
    this.event_site_url = event_site_url;
    this.latitude = latitude;
    this.longitude = longitude;
    this.time_end = time_end;
    this.time_start = time_start;
  }
}

// Function to handle API errors
function handleApiError(response, error) {
  console.error('API Error:', error);

  if (error.response) {
    response.status(error.response.status).send(error.response.data);
  } else {
    response.status(500).send('Internal server error');
  }
}

// Async function to handle fetching events
const handleEvents = async (request, response) => {
  const { location } = request.query;

  if (!location) {
    response.status(400).send({ error: 'Location parameter is required.' });
    return;
  }

  const cacheKey = `events:${location}`;

  if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
    console.log('Using cached data for:', cacheKey);
    response.json(cache[cacheKey].data);
    return;
  }

  try {
    const apiResponse = await axios.get(`https://api.yelp.com/v3/events`, {
      headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` },
      params: { location: location }
    });

    const events = apiResponse.data.events.map(eventData => new Event(
      eventData.description,
      eventData.image_url,
      eventData.name,
      eventData.event_site_url,
      eventData.latitude,
      eventData.longitude,
      eventData.time_end,
      eventData.time_start
    ));

    // Cache the new data with a timestamp
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: events,
    };

    response.json(events);
  } catch (error) {
    handleApiError(response, error);
  }
};

module.exports = handleEvents;
