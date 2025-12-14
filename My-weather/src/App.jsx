import { useState, useEffect } from "react"
import axios from "axios"
import { useDate } from "./utiils/useDate"
import { useStateContext } from "./Context"
import Weather from './component/Weather'
import MiniCard from './component/MiniCard'
import ChangeTheme from './component/ChangeTheme'

export default function App() {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { weather, location, value, setCity, theme } = useStateContext();
  console.log(weather);

  // Fetch cities for autocomplete
  const fetchCities = async (text) => {
    if (text.length > 2) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${import.meta.env.VITE_API_KEY}`
        );
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    fetchCities(value);
  };

  const handleSuggestionClick = (cityName) => {
    setCity(cityName);
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };


  const getDailyForecast = (forecastList) => {
    if (!forecastList || forecastList.length === 0) return [];

    const dailyData = {};

    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();


      if (!dailyData[date]) {
        dailyData[date] = item;
      } else {
        const currentHour = new Date(item.dt * 1000).getHours();
        const existingHour = new Date(dailyData[date].dt * 1000).getHours();

 
        if (Math.abs(currentHour - 12) < Math.abs(existingHour - 12)) {
          dailyData[date] = item;
        }
      }
    });


    return Object.values(dailyData).slice(0, 6);
  };

  const dailyForecast = getDailyForecast(value);

  const submitCity = () => {
    setCity(input)
    setInput('')
    setShowSuggestions(false)
  }

  return (
    <div className={`min-h-screen p-4 transition-colors duration-500 ease-in-out ${theme === 'day'
      ? 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200'
      : 'bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900'
      }`}>
      <div className="max-w-7xl mx-auto">
        <ChangeTheme />
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/20 mb-8 z-50 relative">
          <h1 className={`text-4xl font-extrabold tracking-wider text-center mb-4 ${theme === 'day' ? 'text-gray-800' : 'text-white'}`}>Weather App </h1>

          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  submitCity()
                }
              }}
              type="text"
              className="w-full pl-12 pr-4 py-3 text-lg text-gray-800 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-500"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter city name..."
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full bg-white rounded-lg shadow-xl mt-1 overflow-hidden z-10">
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 font-medium transition-colors border-b border-gray-100 last:border-0"
                    onClick={() => handleSuggestionClick(item.name)}
                  >
                    {item.name}, {item.country}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-6">
          <div className="flex-shrink-0">
            {weather?.main && (
              <Weather
                place={location}
                windspeed={weather.wind?.speed}
                humidity={weather.main?.humidity}
                temperature={weather.main?.temp}
                heatIndex={weather.main?.feels_like}
                iconString={weather.weather?.[0]?.icon || ''}
                condition={weather.weather?.[0]?.description || ''}
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {dailyForecast.map(curr => {
              return (
                <MiniCard
                  key={curr.dt}
                  time={curr.dt}
                  iconString={curr.weather?.[0]?.icon || ''}
                  temperature={curr.main?.temp}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
