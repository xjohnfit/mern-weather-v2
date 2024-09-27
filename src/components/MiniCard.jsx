import { useEffect } from "react";
import { IoSunny } from "react-icons/io5";
import { FaCloud } from "react-icons/fa";
import { BsCloudFog2Fill } from "react-icons/bs";
import { IoRainy } from "react-icons/io5";
import { FaRegSnowflake } from "react-icons/fa";
import { FaPooStorm } from "react-icons/fa";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { useState } from "react";

const MiniCard = ({time, temp, iconString, conditions}) => {

  const [icon, setIcon] = useState();

  useEffect(() => {
    if(iconString){
      if(iconString.toLowerCase().includes('cloud')){
        setIcon(<FaCloud size={50} fill="#A9A9A9" />);
      } else if(iconString.toLowerCase().includes('fog')){
        setIcon(<BsCloudFog2Fill size={50} fill="#DED2CA" />);
      } else if(iconString.toLowerCase().includes('rain')){
        setIcon(<IoRainy size={50} fill="#006ff7" />);
      } else if(iconString.toLowerCase().includes('snow')){
        setIcon(<FaRegSnowflake size={50} fill="#E0E0E0" />);
      } else if(iconString.toLowerCase().includes('storm' || iconString.toLowerCase().includes('thunder'))){
        setIcon(<FaPooStorm size={50} fill="#336699" />);
      } else if(iconString.toLowerCase().includes('wind')){
        setIcon(<TiWeatherWindyCloudy size={50} fill="#2E86C1"  />);
      } else {
        setIcon(<IoSunny size={50} fill="yellow" />);
      }
    }
  }, [iconString]);

  return (
    <div className="glassCard w-[15rem] h-[15rem] p-4 flex flex-col">
      <p className="text-center">
        {new Date(time).toLocaleTimeString('en', {weekday: 'long'}).split(' ')[0]}
      </p>
      <hr />
      <div className="w-full flex flex-col justify-center items-center flex-1 ">
        {icon}
        <p className="text-center text-sm">{conditions}</p>
      </div>
      <p className="text-center font-bold">{temp}&deg;F</p>
    </div>
  )
}

export default MiniCard