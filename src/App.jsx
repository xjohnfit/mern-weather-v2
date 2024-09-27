import { useState } from 'react';
import { FcSearch } from 'react-icons/fc';
import './App.css';
import { useStateContext } from './Context';
import { BackgroundLayout, WeatherCard, MiniCard } from './components';

function App() {
    const [input, setInput] = useState(''); // State for input value
    const { weather, location, values, place, setPlace } = useStateContext();
    const submitCity = () => {
        setPlace(input);
        setInput('');
    };

    return (
        <div className="w-full h-screen text-white px-8">
            <nav className="w-full p-3 flex justify-between items-center">
                <h1 className="font-bold tracking-wide text-3xl">
                    Weather App
                </h1>
                <div className="bg-white w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2 opacity-60">
                    <FcSearch size={60} />
                    <input
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                submitCity();
                            }
                        }}
                        type="text"
                        placeholder="Search city"
                        className="focus:outline-none w-full text-[#212121] text-2xl"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
            </nav>
            <BackgroundLayout />
            <main className="w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center">
                <WeatherCard
                    place={location}
                    windSpeed={weather.wspd}
                    humidity={weather.humidity}
                    temperature={weather.temp}
                    heatIndex={weather.heatindex}
                    iconString={weather.conditions}
                    conditions={weather.conditions}
                />

                <div className="flex justify-center gap-8 flex-wrap w-[60%]">
                    {values?.slice(2, 8).map((current) => {
                        return (
                            <MiniCard
                                key={current.datetime}
                                time={current.datetime}
                                temp={current.temp}
                                iconString={current.conditions}
                                conditions={current.conditions}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default App;
