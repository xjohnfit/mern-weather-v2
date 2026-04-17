import { useEffect, useState } from "react";
import { IoSunny } from "react-icons/io5";
import { FaCloud } from "react-icons/fa";
import { BsCloudFog2Fill } from "react-icons/bs";
import { IoRainy } from "react-icons/io5";
import { FaRegSnowflake } from "react-icons/fa";
import { FaPooStorm } from "react-icons/fa";
import { TiWeatherWindyCloudy } from "react-icons/ti";

const MiniCard = ({ time, temp, iconString, conditions }) => {
  const [icon, setIcon] = useState();

  useEffect(() => {
    if (iconString) {
      const condition = iconString.toLowerCase();
      if (condition.includes('cloud')) {
        setIcon(<FaCloud className="text-4xl text-white/90" />);
      } else if (condition.includes('fog')) {
        setIcon(<BsCloudFog2Fill className="text-4xl text-white/80" />);
      } else if (condition.includes('rain')) {
        setIcon(<IoRainy className="text-4xl text-blue-200" />);
      } else if (condition.includes('snow')) {
        setIcon(<FaRegSnowflake className="text-4xl text-blue-100" />);
      } else if (condition.includes('storm') || condition.includes('thunder')) {
        setIcon(<FaPooStorm className="text-4xl text-yellow-200" />);
      } else if (condition.includes('wind')) {
        setIcon(<TiWeatherWindyCloudy className="text-4xl text-white/90" />);
      } else {
        setIcon(<IoSunny className="text-4xl text-yellow-300" />);
      }
    }
  }, [iconString]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  return (
    <div className="mini-card group">
      <div className="text-center mb-3">
        <p className="text-white font-semibold text-sm">{formatDate(time)}</p>
        <p className="text-white/60 text-xs">{formatTime(time)}</p>
      </div>

      <div className="flex justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <div className="text-center">
        <p className="text-white text-2xl font-bold mb-1">
          {temp ? Math.round(temp) : '--'}&deg;
        </p>
        <p className="text-white/70 text-xs capitalize truncate">{conditions}</p>
      </div>
    </div>
  );
};

export default MiniCard;