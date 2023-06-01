import { useNavigate } from "react-router-dom"
import { useAuth } from "./Auth/checkAuth"
import React, { useState } from 'react';

export function Header({ getLanguage, signOutUser }){
    const navigate = useNavigate()  
    const user = useAuth()

    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        getLanguage(event.target.value);
      };

    return(
        <header>
            <nav>   
                <ul>
                    <div>
                        <div className="languages"> 
                            <select className="language" value={localStorage.getItem("LANG")} onChange={handleChange}>
                            <option className={localStorage.getItem("LANG") == "de" ? "selectedLang" : ""} value="de">German</option>
                            <option className={localStorage.getItem("LANG") == "en" ? "selectedLang" : ""} value="en">English</option>
                            <option className={localStorage.getItem("LANG") == "sq" ? "selectedLang" : ""} value="sq">Albanian</option>
                            <option className={localStorage.getItem("LANG") == "fr" ? "selectedLang" : ""} value="fr">French</option>
                            <option className={localStorage.getItem("LANG") == "ar" ? "selectedLang" : ""} value="ar">Arabic</option>
                            </select>
                        </div>
                        {!user ? 
                            <div className="loginTools">
                                <li><button className="btnStyle" onClick={() => navigate("/Login")}>Login</button></li>
                                <li><button className="btnStyle" onClick={() => navigate("/Registration")}>Register</button></li>
                            </div>
                            :
                            <div className="loginTools">
                                <div className="userCred">&nbsp;{user.email}&nbsp;</div>
                                <li><button className="btnStyle" onClick={signOutUser}>Sign Out</button></li>
                            </div>
                        }
                    </div>
                </ul>
            </nav>
        </header>
    )
}