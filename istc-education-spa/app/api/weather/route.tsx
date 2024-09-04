export const GET = async () => {
    const response = await fetch('https://localhost:7180/WeatherForecast');

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return data;

}
