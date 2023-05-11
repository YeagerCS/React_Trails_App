import { addHours, parse, subHours } from "date-fns";
import { useState } from "react";

export default function WeatherDisplay({ trail, getWeatherStr, close }){
    const [weatherMinus2h, setWeatherMinus2h] = useState({})
    const [weatherCurrent, setWeatherCurrent] = useState({})
    const [weatherPlus2h, setWeatherPlus2h] = useState({})

    async function getWeather(){
        const timeStr = trail.time;
        const time = parse(timeStr, "HH:mm", new Date())

        const timeMinus2h = subHours(time, 2)
        const timePlus2h = addHours(time, 2)

        
    }


    return (
        <div>
            <div>
                <p></p>
                <button className="btn btn-dark btn-outline-danger"></button>
            </div>
        </div>
    )
}