import { useContext, createContext, useState, useEffect } from "react"
import axios from "axios"

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [city, setCity] = useState("Cambodia");
    const [weather, setWeather] = useState({});
    const [location, setLocation] = useState('');
    const [value, setValue] = useState([])
    const [theme, setTheme] = useState('night');

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'night' ? 'day' : 'night'));
    };

    const getWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://api.openweathermap.org/data/2.5/weather',
            params: {
                q: city,
                appid: import.meta.env.VITE_API_KEY,
                units: 'metric',
            }
        };

        const forecastOptions = {
            method: 'GET',
            url: 'https://api.openweathermap.org/data/2.5/forecast',
            params: {
                q: city,
                appid: import.meta.env.VITE_API_KEY,
                units: 'metric',
            }
        };

        try {
            // Fetch both current weather and forecast
            const [weatherResponse, forecastResponse] = await Promise.all([
                axios.request(options),
                axios.request(forecastOptions)
            ]);

            console.log('Current Weather:', weatherResponse.data);
            console.log('Forecast Data:', forecastResponse.data);

            setLocation(weatherResponse.data.name);
            setWeather(weatherResponse.data);
            setValue(forecastResponse.data.list); // Store forecast list

        } catch (error) {
            console.error('Error fetching weather:', error);
            console.error('Error details:', error.response?.data);
        }
    }

    useEffect(() => {
        getWeather();
    }, [city])

    useEffect(() => {
        console.log(value)
    }, [value])

    return (
        <StateContext.Provider value={{ city, setCity, weather, setWeather, location, setLocation, value, setValue, theme, toggleTheme }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
