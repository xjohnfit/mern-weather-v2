import { useContext, createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState('Long Island City');
    const [location, setLocation] = useState('');

    // Helper function to convert Kelvin to Fahrenheit
    const kelvinToFahrenheit = (kelvin) => {
        return ((kelvin - 273.15) * 9 / 5 + 32).toFixed(2);
    };

    const fetchWeather = async () => {
        try {
            let lat, lon;

            // Hardcoded coordinates for common cities (for faster lookup)
            const cityCoords = {
                'Long Island City': { lat: 40.7306, lon: -73.9352 },
                'New York': { lat: 40.7128, lon: -74.0060 },
                'Boston': { lat: 42.3601, lon: -71.0589 },
                'Los Angeles': { lat: 34.0522, lon: -118.2437 },
                'Chicago': { lat: 41.8781, lon: -87.6298 },
                'Miami': { lat: 25.7617, lon: -80.1918 },
                'Seattle': { lat: 47.6062, lon: -122.3321 },
                'San Francisco': { lat: 37.7749, lon: -122.4194 }
            };

            // Check if city is in predefined list
            if (cityCoords[place]) {
                lat = cityCoords[place].lat;
                lon = cityCoords[place].lon;
            } else {
                // Use free geocoding service for other cities
                try {
                    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
                    const geoResponse = await axios.get(geoUrl, {
                        headers: {
                            'User-Agent': 'WeatherApp/1.0'
                        }
                    });

                    if (!geoResponse.data || geoResponse.data.length === 0) {
                        toast.error('City not found. Please try another city.');
                        return;
                    }

                    lat = parseFloat(geoResponse.data[0].lat);
                    lon = parseFloat(geoResponse.data[0].lon);
                } catch (geoError) {
                    console.error('Geocoding error:', geoError);
                    toast.error('Unable to find city. Please try again.');
                    return;
                }
            }

            // Get weather forecast using coordinates
            const weatherOptions = {
                method: 'GET',
                url: 'https://open-weather13.p.rapidapi.com/fivedaysforcast',
                params: {
                    latitude: lat,
                    longitude: lon,
                    lang: 'EN'
                },
                headers: {
                    'x-rapidapi-key': import.meta.env.VITE_API_KEY,
                    'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
                }
            };

            const response = await axios.request(weatherOptions);
            const result = response.data;

            console.log('Weather data (full):', result);

            if (!result || !result.city || !result.list) {
                toast.error('Weather data not available');
                return;
            }

            // Set location
            setLocation(`${result.city.name}, ${result.city.country}`);

            // Transform the list array to match component expectations
            const transformedValues = result.list.map(item => ({
                datetime: item.dt_txt,
                temp: kelvinToFahrenheit(item.main.temp),
                conditions: item.weather[0].main,
                description: item.weather[0].description,
                humidity: item.main.humidity,
                wspd: (item.wind.speed * 2.237).toFixed(2), // Convert m/s to mph
                pressure: item.main.pressure,
                feels_like: kelvinToFahrenheit(item.main.feels_like),
                temp_min: kelvinToFahrenheit(item.main.temp_min),
                temp_max: kelvinToFahrenheit(item.main.temp_max),
                icon: item.weather[0].icon,
                clouds: item.clouds.all,
                pop: item.pop || 0 // probability of precipitation
            }));

            setValues(transformedValues);

            // Set current weather (first item in the list)
            if (transformedValues.length > 0) {
                const currentWeather = transformedValues[0];
                setWeather({
                    temp: currentWeather.temp,
                    conditions: currentWeather.conditions,
                    description: currentWeather.description,
                    humidity: currentWeather.humidity,
                    wspd: currentWeather.wspd,
                    heatindex: currentWeather.feels_like, // Using feels_like as heat index
                    pressure: currentWeather.pressure,
                    temp_min: currentWeather.temp_min,
                    temp_max: currentWeather.temp_max
                });
            }

        } catch (error) {
            console.error('Weather fetch error:', error);
            toast.error('Failed to fetch weather data');
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [place]);

    return (
        <StateContext.Provider value={{ weather, values, setPlace, location, place }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
