import { Home } from "./Home";
import NotFound from "./NotFound";
import "./styles.css"
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import _translations from "./translations.json"
import { useEffect, useState } from "react";
import Registration from "./Auth/Registration";
import Login from "./Auth/Login";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "./Auth/fire";


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

  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" index element={<Home dragDiv={dragDiv} t={t} getLanguage={getLanguage}/>}/>
          <Route path="/Registration" element={<Registration/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/*" element={<NotFound t={t}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
} 