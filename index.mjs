import * as fs from 'node:fs/promises';
import express from "express";

async function loadConfig(filename) {
    const data = await fs.readFile(filename);
    return JSON.parse(data);
}

async function get_weather(town) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${town}&units=metric&appid=${process.env.OPENWEATHERMAP_APIKEY}`)
    const weather = await response.json()

    let weather_exported = "";

    weather_exported += `
weather_${town}_temp ${weather.main.temp}
weather_${town}_feels_like ${weather.main.feels_like}
weather_${town}_temp_min ${weather.main.temp_min}
weather_${town}_temp_max ${weather.main.temp_max}
weather_${town}_pressure ${weather.main.pressure}
weather_${town}_humidity ${weather.main.humidity}
weather_${town}_wind_speed ${weather.wind.speed}
weather_${town}_wind_deg ${weather.wind.deg}
weather_${town}_clouds_all ${weather.clouds.all}
`
//console.log(weather)


    return weather_exported;
}

let config = {};

try {
    config = await loadConfig("config.json");
}
catch(err) {
    console.error(err);
}

const app = express();
const port = config.port;

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.send(await get_weather(config.town));
});

app.listen(port, () => {
    console.log(`Openweathermap exporter listening on port ${port}`)
});