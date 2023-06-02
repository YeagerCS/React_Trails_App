import { Home } from "./Home";
import NotFound from "./NotFound";
import "./styles.css"
import {BrowserRouter, Routes, Route, useNavigate, Navigate, useAsyncError} from 'react-router-dom'
import _translations from "./translations.json"
import { useEffect, useState } from "react";
import Registration from "./Auth/Registration";
import Login from "./Auth/Login";
import { useAuth } from "./Auth/checkAuth";
import TrailView from "./TrailView";

const apikey = "621e2c097166ed6ba8f64cbed0173994"


export default function App(){
  const [t, setT] = useState(() => {
    if(localStorage.getItem("LANG")){
        return localStorage.getItem("LANG")
    }

    return _translations.en;
  })

  function getLanguage(lang){
    localStorage.setItem("LANG", lang)
    const selectedLang = eval("_translations." + lang) 
    setT(selectedLang)
  }

  useEffect(() => {
    if(localStorage.getItem("LANG")){
      getLanguage(localStorage.getItem("LANG"))
    } else{
      getLanguage("en")
    }

  }, [])

  function dragDiv(elemId, mapContainerRef = null){
    const mapDiv = document.getElementById(elemId);
    
    let isDragging = false;
    let mouseX = 0;
    let mouseY = 0;
    let offsetX = 0;
    let offsetY = 0;
  
    const handleMouseDown = (e) => {
      isDragging = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      offsetX = parseInt(window.getComputedStyle(mapDiv).left, 10);
      offsetY = parseInt(window.getComputedStyle(mapDiv).top, 10);
    };
  
    const handleMouseMove = (e) => {
      if (isDragging && !isMouseOverMap(e)) {
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        mapDiv.style.left = `${offsetX + deltaX}px`;
        mapDiv.style.top = `${offsetY + deltaY}px`;
      }
    };
  
    const handleMouseUp = () => {
      isDragging = false;
    };
  
    const isMouseOverMap = (e) => {
      let mapContainer;
      if(mapContainerRef){
        mapContainer = mapContainerRef.current;
      } else{
        return false
      }
      const rect = mapContainer.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      return (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      );
    };
  
    mapDiv.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  
    return () => {
      mapDiv.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
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

  const isLoggedIn = useAuth()
  

  return (
    <>
      <BrowserRouter> 
        <Routes>
          {isLoggedIn ? (
            <>
              <Route exact path="/" element={<Home dragDiv={dragDiv} t={t} getLanguage={getLanguage} getWeatherStr={getWeatherStr}/>} />
              <Route path="/View" element={<TrailView getWeatherStr={getWeatherStr}/>}/>
            </>
          ) : (
            <>
              <Route exact path="/" element={<Navigate to="/Login"/>} />
              <Route path="/View" element={<Navigate to="/Login"/>}/>
            </>
          )}
          <Route path="/Registration" element={<Registration/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/*" element={<NotFound t={t}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
} 