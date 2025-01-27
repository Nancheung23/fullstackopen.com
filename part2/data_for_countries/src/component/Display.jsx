// 2.12* Data for countries, step1
import axios from 'axios';
// 2.13 *: Data for countries, step2
import Show from './Show';
import { useState } from 'react';

const Display = ({ countries, clickHandler }) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const [currentWeather, setCurrentWeather] = useState({});

    if (countries.length === 0 || countries.length > 10) {
        return (
            <p>
                Too many matches, specify another filter
            </p>
        );
    } else if (countries.length === 1) {
        const country = countries[0];
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]},${country.flag.toLowerCase()}&appid=${apiKey}`)
            .then(res => {
                const data = res.data;
                const weather = {
                    temperature: data.main.temp,
                    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                    wind_speed: data.wind.speed
                };
                setCurrentWeather(weather);
            });
        return (
            <div>
                <h1>{country.name.common}</h1>
                <div>
                    <p>capital {country.capital[0]}</p>
                    <p>area {country.area}</p>
                </div>
                <h3>languages:</h3>
                <ul>
                    {
                        Object.values(country.languages).map((language, i) =>
                            <li key={i}>{language}</li>
                        )
                    }
                </ul>
                <img style={
                    { width: "200px", height: "100%" }
                } src={country.flags.svg} alt={`${country.name.common};s flag`} />
                <h2>Weather in {country.capital[0]}</h2>
                <div>
                    <p>temperature {currentWeather.temperature} Celcius</p>
                    <img style={{ background: "gray" }} src={currentWeather.icon} alt="icon" />
                    <p>wind {currentWeather.wind_speed} m/s</p>
                </div>
            </div>
        );
    } else if (countries.length > 1 && countries.length <= 10) {
        return (
            <>
                {
                    // 2.13 *: Data for countries, step2
                    countries.map(country =>
                        <Show
                            key={country.area}
                            name={country.name.common} handler={() => clickHandler(country.area)}
                        />
                    )
                }
            </>
        );
    } else {
        return <p>rendering...</p>
    };
};

export default Display;