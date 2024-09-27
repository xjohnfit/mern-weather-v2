import { useEffect, useState } from 'react';
import { useDate } from '../Utils/useDate';
import { IoSunny } from 'react-icons/io5';
import { FaCloud } from 'react-icons/fa';
import { BsCloudFog2Fill } from 'react-icons/bs';
import { IoRainy } from 'react-icons/io5';
import { FaRegSnowflake } from 'react-icons/fa';
import { FaPooStorm } from 'react-icons/fa';
import { TiWeatherWindyCloudy } from 'react-icons/ti';
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
            if (iconString.toLowerCase().includes('cloudy')) {
                setIcon(<FaCloud size={50} />);
            } else if (iconString.toLowerCase().includes('fog')) {
                setIcon(<BsCloudFog2Fill size={50} />);
            } else if (iconString.toLowerCase().includes('rain')) {
                setIcon(<IoRainy size={50} />);
            } else if (iconString.toLowerCase().includes('snow')) {
                setIcon(<FaRegSnowflake size={50} />);
            } else if (
                iconString
                    .toLowerCase()
                    .includes(
                        'storm' || iconString.toLowerCase().includes('thunder')
                    )
            ) {
                setIcon(<FaPooStorm size={50} />);
            } else if (iconString.toLowerCase().includes('wind')) {
                setIcon(<TiWeatherWindyCloudy size={50} />);
            } else {
                setIcon(<IoSunny size={50} />);
            }
        }
    }, [iconString]);

    return (
        <div className="w-[25rem] min-w-[25rem] h-[35rem] glassCard p-4">
            <div className="flex w-full justify-center items-center gap-4 mt-12 mb-4">
                {icon}
                <p className="font-bold text-5xl flex justify-center items-center">
                    {temperature}&deg;F
                </p>
            </div>
            <div className="font-bold text-center text-xl">{place}</div>
            <div className="w-full flex justify-between items-center mt-4">
                <p className="flex-1 text-center p-2 text-lg">
                    {new Date().toDateString()}
                </p>
                <p className="flex-1 text-center p-2 text-lg">{time}</p>
            </div>
            <div className="w-full flex justify-between items-center mt-4 gap-4">
                <div className="flex-1 text-center p-2 font-bold bg-blue-600 shadow rounded-lg">
                    Wind Speed
                    <p className="font-normal">{windSpeed} KM/H</p>
                </div>
                <div className="flex-1 text-center p-2 font-bold rounded-lg bg-green-600">
                    Humidity
                    <p className="font-normal">{humidity} GM/m&#179;</p>
                </div>
            </div>
            <div className="w-full p-3 mt-4 flex justify-between items-center">
                <p className="font-semibold text-lg">Heat Index</p>
                <p className="font-semibold">{heatIndex ? heatIndex : 'N/A'}</p>
            </div>
            <hr className="bg-slate-600" />
            <div className="w-full p-4 flex justify-center items-center text-3xl font-semibold">
                {conditions}
            </div>
        </div>
    );
};

export default WeatherCard;
