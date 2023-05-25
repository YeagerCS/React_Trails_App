export function Header({ getLanguage }){
    return(
        <header>
            <nav>   
                <ul>
                    <div>
                        <li><button className={localStorage.getItem("LANG") == "de" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("de")}>German</button></li>
                        <li><button className={localStorage.getItem("LANG") == "en" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("en")}>English</button></li>
                        <li><button className={localStorage.getItem("LANG") == "sq" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("sq")}>Albanian</button></li>
                        <li><button className={localStorage.getItem("LANG") == "fr" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("fr")}>French</button></li>
                        <li><button className={localStorage.getItem("LANG") == "ar" ? "btn btn-primary selectedLang" : "btn btn-primary"} onClick={() => getLanguage("ar")}>Arabic</button></li>
                    </div>
                </ul>
            </nav>
        </header>
    )
}