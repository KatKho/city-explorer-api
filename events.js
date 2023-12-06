'use strict';

const axios = require('axios');
const cache = {};
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

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

function handleApiError(response, error) {
  console.error('API Error:', error);
  if (error.response) {
    response.status(error.response.status).send(error.response.data);
  } else {
    response.status(500).send('Internal server error');
  }
}

const handleEvents = async (request, response) => {
  const { location, start_date } = request.query;

  if (!location) {
    response.status(400).send({ error: 'Location parameter is required.' });
    return;
  }

  // Prepare the cache key with start_date if it's provided
  const cacheKey = `events:${location}:${start_date || ''}`;

  if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
    console.log('Using cached data for:', cacheKey);
    response.json(cache[cacheKey].data);
    return;
  }

  try {
    const params = { location };
    if (start_date) {
      params.start_date = parseInt(start_date, 10);
    }

    const apiResponse = await axios.get(`https://api.yelp.com/v3/events`, {
      headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` },
      params: params
    });

    const eventsData = apiResponse.data.events.map(eventData => new Event(
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
      data: eventsData,
    };

    response.json(eventsData);
  } catch (error) {
    handleApiError(response, error);
  }
};

module.exports = handleEvents;
