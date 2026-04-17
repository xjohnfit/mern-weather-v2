import { useStateContext } from '../Context';
import { useEffect, useState } from 'react';

import clearWeather from '../assets/clear-weather.jpg';
import cloudyWeather from '../assets/cloudy-weather.jpg';
import fogWeather from '../assets/fog-weather.jpg';
import rainyWeather from '../assets/rainy-weather.jpg';
import snowWeather from '../assets/snow-weather.jpg';
import stormWeather from '../assets/stormy-weather.jpg';
import sunnyWeather from '../assets/sunny-weather.jpg';

const BackgroundLayout = () => {
    const { weather } = useStateContext();
    const [image, setImage] = useState(clearWeather);

    useEffect(() => {
        if (weather.conditions) {
            const condition = weather.conditions.toLowerCase();

            if (condition.includes('clear')) {
                setImage(clearWeather);
            } else if (condition.includes('cloud')) {
                setImage(cloudyWeather);
            } else if (condition.includes('fog')) {
                setImage(fogWeather);
            } else if (condition.includes('rain')) {
                setImage(rainyWeather);
            } else if (condition.includes('snow')) {
                setImage(snowWeather);
            } else if (condition.includes('storm') || condition.includes('thunder')) {
                setImage(stormWeather);
            } else if (condition.includes('sunny')) {
                setImage(sunnyWeather);
            }
        }
    }, [weather]);

    return (
        <>
            <img
                src={image}
                alt="Weather Background"
                className='h-screen w-full fixed left-0 top-0 -z-20 object-cover'
            />
            {/* Subtle overlay to blend with gradient */}
            <div className='h-screen w-full fixed left-0 top-0 -z-10 bg-gradient-to-br from-blue-500/40 via-purple-600/40 to-pink-500/40'></div>
        </>
    );
};

export default BackgroundLayout;
