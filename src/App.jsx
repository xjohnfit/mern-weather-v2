import { useState, useEffect, useRef } from 'react';
import { HiSearch, HiLocationMarker } from 'react-icons/hi';
import './App.css';
import { useStateContext } from './Context';
import { BackgroundLayout, WeatherCard, MiniCard } from './components';
import axios from 'axios';

function App() {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const { weather, location, values, setPlace } = useStateContext();

    // Predefined popular cities
    const popularCities = [
        'Long Island City',
        'New York',
        'Boston',
        'Los Angeles',
        'Chicago',
        'Miami',
        'Seattle',
        'San Francisco',
        'Houston',
        'Phoenix',
        'Philadelphia',
        'San Diego',
        'Dallas',
        'Austin',
        'Las Vegas'
    ];

    const submitCity = (city) => {
        const cityName = city || input;
        if (cityName.trim()) {
            setPlace(cityName);
            setInput('');
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    // Fetch suggestions from geocoding API
    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        setIsLoading(true);

        // First, filter from popular cities
        const localMatches = popularCities
            .filter(city => city.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);

        try {
            // Fetch from geocoding API for more results
            const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1`;
            const response = await axios.get(geoUrl, {
                headers: {
                    'User-Agent': 'WeatherApp/1.0'
                }
            });

            const apiResults = response.data
                .filter(item => item.address && (item.address.city || item.address.town || item.address.village))
                .map(item => {
                    const cityName = item.address.city || item.address.town || item.address.village;
                    const country = item.address.country;
                    const state = item.address.state;
                    return {
                        name: cityName,
                        display: state ? `${cityName}, ${state}, ${country}` : `${cityName}, ${country}`,
                        lat: item.lat,
                        lon: item.lon
                    };
                });

            // Combine and deduplicate
            const combinedResults = [
                ...localMatches.map(city => ({ name: city, display: city })),
                ...apiResults
            ];

            // Remove duplicates based on city name
            const uniqueResults = combinedResults.filter((item, index, self) =>
                index === self.findIndex((t) => t.name.toLowerCase() === item.name.toLowerCase())
            );

            setSuggestions(uniqueResults.slice(0, 8));
            setShowDropdown(uniqueResults.length > 0);
        } catch (error) {
            // If API fails, just show local matches
            setSuggestions(localMatches.map(city => ({ name: city, display: city })));
            setShowDropdown(localMatches.length > 0);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (input) {
                fetchSuggestions(input);
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [input]);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
            <BackgroundLayout />

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                                <HiLocationMarker className="text-white text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    Weather Forecast
                                </h1>
                                <p className="text-white/80 text-sm mt-1">Real-time weather updates</p>
                            </div>
                        </div>

                        {/* Modern Search Bar with Autocomplete */}
                        <div className="modern-search-container" ref={dropdownRef}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search city..."
                                    className="modern-search-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyUp={(e) => e.key === 'Enter' && submitCity()}
                                    onFocus={() => input.length >= 2 && suggestions.length > 0 && setShowDropdown(true)}
                                />
                                <button
                                    onClick={() => submitCity()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-purple-600 p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
                                >
                                    <HiSearch className="text-xl" />
                                </button>

                                {/* Autocomplete Dropdown */}
                                {showDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden z-50 max-h-80 overflow-y-auto">
                                        {isLoading ? (
                                            <div className="px-4 py-3 text-gray-500 text-center">
                                                Loading...
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => submitCity(suggestion.name)}
                                                    className="w-full px-4 py-3 text-left hover:bg-purple-100 transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                                                >
                                                    <HiLocationMarker className="text-purple-600 text-lg flex-shrink-0" />
                                                    <div>
                                                        <div className="text-gray-800 font-medium">{suggestion.name}</div>
                                                        {suggestion.display !== suggestion.name && (
                                                            <div className="text-gray-500 text-xs">{suggestion.display}</div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-gray-500 text-center">
                                                No cities found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="space-y-8">
                    {/* Current Weather Card */}
                    <div className="flex justify-center">
                        <WeatherCard
                            place={location}
                            windSpeed={weather.wspd}
                            humidity={weather.humidity}
                            temperature={weather.temp}
                            heatIndex={weather.heatindex}
                            iconString={weather.conditions}
                            conditions={weather.conditions}
                        />
                    </div>

                    {/* Forecast Cards */}
                    {values && values.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-white text-center md:text-left px-4">
                                5-Day Forecast
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {values?.slice(1, 7).map((current) => (
                                    <MiniCard
                                        key={current.datetime}
                                        time={current.datetime}
                                        temp={current.temp}
                                        iconString={current.conditions}
                                        conditions={current.conditions}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
