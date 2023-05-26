import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { returnAuth } from "./fire" 
import "./styles.css"

const LoginPopup = ({ handleTogglePopup }) => {
  
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const auth = returnAuth();
signInWithEmailAndPassword(auth, username, password)
  .then((userCredential) => {
    handleTogglePopup();
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Login</h2>
        <form>
          <input
            id="boxStyle"
            className='boxStyle'
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
          <input
            id="boxStyle"
            className='boxStyle'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <br />
          <button className='LoginButton' type="button" onClick={handleLogin}>Login</button>
          <p id='keinKontoText'>Noch kein Konto? eröffne jetzt eines <a href='/Registration'>hier</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
