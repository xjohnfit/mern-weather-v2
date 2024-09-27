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
            let imageString = weather.conditions;

            if (imageString.toLowerCase().includes('clear')) {
                setImage(clearWeather);
            } else if(imageString.toLowerCase().includes('cloudy')) {
                setImage(cloudyWeather);
            } else if(imageString.toLowerCase().includes('fog')) {
                setImage(fogWeather);
            } else if(imageString.toLowerCase().includes('rain')) {
                setImage(rainyWeather);
            } else if(imageString.toLowerCase().includes('snow')) {
                setImage(snowWeather);
            } else if(imageString.toLowerCase().includes('storm' || imageString.toLowerCase().includes('thunder'))) {
                setImage(stormWeather);
            } else if(imageString.toLowerCase().includes('sunny')) {
                setImage(sunnyWeather);
            }
        }
    }, [weather]);

    return (
      <img src={image} alt="Weather Image" className='h-screen w-full fixed left-0 top-0 -z-10' />
    );
};

export default BackgroundLayout;
