import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./Auth/checkAuth"
import React, { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "./Auth/fire";

export function Header({ getLanguage, signOutUser = null }){
    const navigate = useNavigate()  
    const user = useAuth()

    function signOutUsr(){
        signOut(auth)
        localStorage.removeItem("authUser")
    }

    const handleChange = (event) => {
        getLanguage(event.target.value);
    };

    return(
        <header>
            <nav>   
                <ul>
                    <div>
                        <div><Link to="/"><button className="btnStyle">Home</button></Link></div>
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
                                <img src={user.photoURL} alt="pb" className="profilePic"/>
                                <div className="userCred">&nbsp;{user.email}&nbsp;</div>
                                <li><button className="btnStyle" onClick={() => signOutUser ? signOutUser() : signOutUsr()}>Sign Out</button></li>
                            </div>
                        }
                    </div>
                </ul>
            </nav>
        </header>
    )
}