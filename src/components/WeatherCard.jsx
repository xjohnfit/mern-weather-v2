import { useEffect, useState } from 'react';
import { useDate } from '../Utils/useDate';
import { IoSunny } from 'react-icons/io5';
import { FaCloud, FaWind } from 'react-icons/fa';
import { BsCloudFog2Fill, BsDropletFill } from 'react-icons/bs';
import { IoRainy } from 'react-icons/io5';
import { FaRegSnowflake } from 'react-icons/fa';
import { FaPooStorm } from 'react-icons/fa';
import { TiWeatherWindyCloudy } from 'react-icons/ti';
import { WiThermometer } from 'react-icons/wi';
import '../index.css';

const WeatherCard = ({
    temperature,
    windSpeed,
    humidity,
    place,
    heatIndex,
    iconString,
    conditions,
}) => {
    const [icon, setIcon] = useState('');
    const { time } = useDate();

    useEffect(() => {
        if (iconString) {
            const condition = iconString.toLowerCase();
            if (condition.includes('cloud')) {
                setIcon(<FaCloud size={80} className="text-white drop-shadow-lg" />);
            } else if (condition.includes('fog')) {
                setIcon(<BsCloudFog2Fill size={80} className="text-white/90 drop-shadow-lg" />);
            } else if (condition.includes('rain')) {
                setIcon(<IoRainy size={80} className="text-blue-200 drop-shadow-lg" />);
            } else if (condition.includes('snow')) {
                setIcon(<FaRegSnowflake size={80} className="text-blue-100 drop-shadow-lg" />);
            } else if (condition.includes('storm') || condition.includes('thunder')) {
                setIcon(<FaPooStorm size={80} className="text-yellow-200 drop-shadow-lg" />);
            } else if (condition.includes('wind')) {
                setIcon(<TiWeatherWindyCloudy size={80} className="text-white drop-shadow-lg" />);
            } else {
                setIcon(<IoSunny size={80} className="text-yellow-300 drop-shadow-lg" />);
            }
        }
    }, [iconString]);

    return (
        <div className="w-full max-w-[450px] modern-card p-8">
            {/* Location & Time */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">{place || 'Loading...'}</h2>
                <p className="text-white/70 text-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-white/60 text-sm mt-1">{time}</p>
            </div>

            {/* Main Temperature Display */}
            <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 animate-float">
                    {icon}
                </div>
                <div className="text-7xl font-bold text-white mb-2">
                    {temperature ? Math.round(temperature) : '--'}<span className="text-5xl">&deg;</span>
                </div>
                <p className="text-2xl text-white/90 font-medium capitalize">
                    {conditions || 'N/A'}
                </p>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="stat-card">
                    <FaWind className="text-2xl text-white/80 mb-2" />
                    <p className="text-white/60 text-xs mb-1">Wind</p>
                    <p className="text-white font-semibold">{windSpeed || '--'} mph</p>
                </div>

                <div className="stat-card">
                    <BsDropletFill className="text-2xl text-white/80 mb-2" />
                    <p className="text-white/60 text-xs mb-1">Humidity</p>
                    <p className="text-white font-semibold">{humidity || '--'}%</p>
                </div>

                <div className="stat-card">
                    <WiThermometer className="text-3xl text-white/80 mb-1" />
                    <p className="text-white/60 text-xs mb-1">Feels Like</p>
                    <p className="text-white font-semibold">{heatIndex ? Math.round(heatIndex) : '--'}&deg;</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
