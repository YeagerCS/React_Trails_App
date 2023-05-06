import { TrailsForm } from "./TrailsForm";
import "./styles.css"
import {BrowserRouter, Routes, Route} from 'react-router-dom'


export default function App(){

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" index element={<TrailsForm/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}