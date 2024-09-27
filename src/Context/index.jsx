import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState('Boston, MA');
    const [location, setLocation] = useState('');

    //Fetch the API

    const fetchWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: { 
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'us',
                shortColumnNames: false, 
            },
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_API_KEY,
                'x-rapidapi-host': 'visual-crossing-weather.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            const thisData = Object.values(response.data.locations)[0];
            setLocation(thisData.address);
            setValues(thisData.values);
            setWeather(thisData.values[0]);
            
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [place]);

    useEffect(() => {
        console.log(values);
    }, [values]);

    return (
        <StateContext.Provider value={{ weather, values, setPlace, location, place }}>
            {children}
        </StateContext.Provider>
    );

}

export const useStateContext = () => useContext(StateContext);
