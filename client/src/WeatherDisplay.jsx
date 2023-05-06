import { useState } from "react";

export default function WeatherDisplay({ location }){
    const [weatherMinus2h, setWeatherMinus2h] = useState("")
    const [weatherCurrent, setWeatherCurrent] = useState("")
    const [weatherPlus2h, setWeatherPlus2h] = useState("")
}