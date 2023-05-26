import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//import fire from './fire';   
import "./styles.css"

const LoginPopup = ({ handleTogglePopup }) => {
  
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
  .then((userCredential) => {
    console.log("logged in")
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
        
    handleTogglePopup();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Login</h2>
        <form>
          <input
            id="email"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <br />
          <button className='LoginButton' type="button" onClick={handleLogin}>Login</button>
          <button className='CloseButton' type="button" onClick={handleTogglePopup}>Close</button>
          <p>Noch kein Konto? eröffne jetzt eines </p> <a href='/Registration'>hier</a>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
