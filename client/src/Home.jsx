import { useEffect, useState } from "react";
import React from "react"
import Dialog from "./Dialog";  
import WeatherDisplay from "./WeatherDisplay";
import { Header } from "./Header";
import { TrailsForm } from "./TrailsForm";



const apikey = "621e2c097166ed6ba8f64cbed0173994"



export function Home({t, getLanguage, dragDiv}){
   
    const [displayDialog, setDisplayDialog] = useState(false)
    const [selectedTrail, setSelectedTrail] = useState([])
    const [weatherDisplay, setWeatherDisplay] = useState(false)
    
   
    function getFormattedDate(stringDate){
        const currentDate = new Date(stringDate)
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
      
        return formattedDate;
    }

    

    

    function fetchWeather(date, time, _destination) {
        const unixTimestamp = "1970-01-01T";

        const selectedDate = new Date(date);
        const selctedTime = new Date(unixTimestamp + time + ":00")
        const timestamp = Math.floor((selectedDate.getTime() + selctedTime.getTime()) / 1000);
        // const { latitude, longitude } = location;
        // console.log(latitude, longitude, timestamp)
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+ _destination +"&appid=" + apikey;
      
        return fetch(url)
          .then(response => response.json())
          .then(data => {
            if(data.cod === 200){
                return [data.weather[0].main, Math.round(data.main.temp - 273.15)];
            } else{
                return data.cod
            }
        });
    }

    async function getWeatherStr(date, time, destination){
        try{
            const weather = await fetchWeather(date, time, destination);
            return weather; 
        } catch(error){
            console.error(error);
        }
    }


    useEffect(() => {
        let lang = localStorage.getItem("LANG")
        if(lang){
            getLanguage(lang)
        }
        console.log(t);
    }, [])

    

    function setSelected(trail){
        setWeatherDisplay(!weatherDisplay)
        setSelectedTrail(trail)
    }
    

    return(
        <>
            {weatherDisplay && <WeatherDisplay close={() => setWeatherDisplay(false)} trail={selectedTrail} getWeatherStr={getWeatherStr} dragDiv={dragDiv}/>}
            {displayDialog[0] && <Dialog closeAlert={() => setDisplayDialog([false, []])} message={displayDialog[1]}/>}
            <div id="HomeDiv">
                <Header getLanguage={getLanguage}/>
                <TrailsForm t={t} setSelected={setSelected} getWeatherStr={getWeatherStr} getFormattedDate={getFormattedDate} setDisplayDialog={setDisplayDialog} dragDiv={dragDiv}/>
            </div>
        </> 
    )
}