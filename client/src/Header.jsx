import { useNavigate } from "react-router-dom"
import { useAuth } from "./Auth/checkAuth"
import React, { useState } from 'react';

export function Header({ getLanguage, signOutUser }){
    const navigate = useNavigate()  
    const user = useAuth()

    const handleChange = (event) => {
        getLanguage(event.target.value);
    };

    return(
        <header>
            <nav>   
                <ul>
                    <div>
                        <div className="languages"> 
                            <select className="language" value={localStorage.getItem("LANG")} onChange={handleChange}>
                            <option value="de">German</option>
                            <option value="en">English</option>
                            <option value="sq">Albanian</option>
                            <option value="fr">French</option>
                            <option value="ar">Arabic</option>
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