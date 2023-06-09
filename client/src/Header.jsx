import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./Auth/checkAuth"
import React, { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "./Auth/fire";
import Modal from "react-bootstrap/Modal";

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

    useEffect(() => {
        document.getElementById("pp").src = user.photoURL;
    }, [user])

    const openPopup = () => {
        const dialog = document.getElementById('account-dialog');
        dialog.showModal();
      };
    
      const closePopup = () => {
        const dialog = document.getElementById('account-dialog');
        dialog.close();
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
                                <img onClick={openPopup} src="" className="profilePic" id="pp"/>
                              <dialog id="account-dialog">
                                {user ? (
                                  <>
                                    <h2>Account</h2>
                                    <p><img src={user.photoURL} className="profilePic" id="pp"/> {user.displayName} </p>
                                    <p>Email: {user.email}</p>
                                    
                                    <button onClick={closePopup}>Close</button>
                                  </>
                                ) : (
                                  <p>Loading...</p>
                                )}
                              </dialog>
                                <li><button className="btnStyle" onClick={() => signOutUser ? signOutUser() : signOutUsr()}>Sign Out</button></li>
                            </div>
                        }
                    </div>
                </ul>
            </nav>
        </header>
    )
}