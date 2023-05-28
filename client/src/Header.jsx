import { useNavigate } from "react-router-dom"
import { useAuth } from "./Auth/checkAuth"

export function Header({ getLanguage, signOutUser }){
    const navigate = useNavigate()  
    const user = useAuth()

    return(
        <header>
            <nav>   
                <ul>
                    <div>
                        <div className="languages">
                            <li><button className={localStorage.getItem("LANG") == "de" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("de")}>German</button></li>
                            <li><button className={localStorage.getItem("LANG") == "en" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("en")}>English</button></li>
                            <li><button className={localStorage.getItem("LANG") == "sq" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("sq")}>Albanian</button></li>
                            <li><button className={localStorage.getItem("LANG") == "fr" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("fr")}>French</button></li>
                            <li><button className={localStorage.getItem("LANG") == "ar" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("ar")}>Arabic</button></li>
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