const axios = require('axios');

async function getWeather(query) {
    try {
        // 1. Geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=es&format=json`;
        const geoRes = await axios.get(geoUrl);

        if (!geoRes.data.results) return null;

        const { latitude, longitude, name, country, timezone } = geoRes.data.results[0];

        // 2. Weather Data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=${timezone}`;
        const weatherRes = await axios.get(weatherUrl);

        const current = weatherRes.data.current_weather;
        const daily = weatherRes.data.daily;

        return {
            location: `${name}, ${country}`,
            temp: current.temperature,
            wind: current.windspeed,
            max: daily.temperature_2m_max[0],
            min: daily.temperature_2m_min[0]
        };
    } catch (error) {
        console.error('Weather Error:', error);
        throw error;
    }
}

module.exports = { getWeather };
