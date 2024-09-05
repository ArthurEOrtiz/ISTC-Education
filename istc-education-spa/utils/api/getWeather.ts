import fetch from 'node-fetch';
import fs from 'fs';
import https from 'https';
import path from "path";

const agent = new https.Agent({
    //ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'istceducation.pfx')),
    rejectUnauthorized: false // This is not recommended for production, but this will accept self-signed certificates.
}); 

// C:\Users\arortiz\Desktop\Projects\NextJs\ISTC-Education\istc-education-spa\certs\istceducation.pfx

export const getWeather = async () => {
    const response = await fetch('https://localhost:7180/WeatherForecast',{
            agent
    }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return data;
}