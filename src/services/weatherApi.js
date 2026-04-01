import axios from 'axios'

const API_URL = 'https://api.open-meteo.com/v1/forecast'
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'

const WEATHER_CODE_MAP = {
  0: { description: 'Ciel degage', emoji: '☀️' },
  1: { description: 'Principalement degage', emoji: '🌤️' },
  2: { description: 'Partiellement nuageux', emoji: '⛅' },
  3: { description: 'Couvert', emoji: '☁️' },
  45: { description: 'Brouillard', emoji: '🌫️' },
  48: { description: 'Brouillard givrant', emoji: '🌫️' },
  51: { description: 'Bruine legere', emoji: '🌦️' },
  53: { description: 'Bruine moderee', emoji: '🌦️' },
  55: { description: 'Bruine forte', emoji: '🌧️' },
  61: { description: 'Pluie legere', emoji: '🌧️' },
  63: { description: 'Pluie moderee', emoji: '🌧️' },
  65: { description: 'Pluie forte', emoji: '🌧️' },
  71: { description: 'Neige legere', emoji: '🌨️' },
  73: { description: 'Neige moderee', emoji: '🌨️' },
  75: { description: 'Neige forte', emoji: '❄️' },
  80: { description: 'Averses legeres', emoji: '🌦️' },
  81: { description: 'Averses moderees', emoji: '🌧️' },
  82: { description: 'Averses fortes', emoji: '⛈️' },
  95: { description: 'Orage', emoji: '⛈️' },
}

export async function fetchWeatherByCity(city) {
  const response = await axios.get(API_URL, {
    params: {
      latitude: city.latitude,
      longitude: city.longitude,
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
      timezone: 'auto',
    },
  })

  const current = response.data.current
  const weatherInfo = WEATHER_CODE_MAP[current.weather_code] || {
    description: 'Conditions variables',
    emoji: '🌍',
  }

  return {
    id: city.id,
    name: city.name,
    temp: Number(current.temperature_2m.toFixed(1)),
    humidity: current.relative_humidity_2m,
    wind: Number(current.wind_speed_10m.toFixed(1)),
    description: weatherInfo.description,
    iconText: weatherInfo.emoji,
  }
}

export async function geocodeCityByName(name) {
  const response = await axios.get(GEO_API_URL, {
    params: {
      name,
      count: 1,
      language: 'fr',
      format: 'json',
    },
  })

  const firstResult = response.data?.results?.[0]
  if (!firstResult) {
    throw new Error('city_not_found')
  }

  return {
    id: firstResult.id || `${firstResult.latitude}-${firstResult.longitude}`,
    name: firstResult.name,
    latitude: firstResult.latitude,
    longitude: firstResult.longitude,
  }
}

