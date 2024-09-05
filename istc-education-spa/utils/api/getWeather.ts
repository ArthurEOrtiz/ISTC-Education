import fetch from 'node-fetch';
import { agent } from './agent';

export const getWeather = async () => {
    const response = await fetch('https://localhost:7180/WeatherForecast', {agent});

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return data;
}