import { Home } from "./Home";
import NotFound from "./NotFound";
import "./styles.css"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import _translations from "./translations.json"
import { useEffect, useState } from "react";


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

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" index element={<Home t={t} getLanguage={getLanguage}/>}/>
          <Route path="/*" element={<NotFound t={t}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}