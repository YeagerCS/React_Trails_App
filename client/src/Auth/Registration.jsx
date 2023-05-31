import React, { useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "./fire"
import { useNavigate } from 'react-router-dom';
import { useAuth } from './checkAuth';

export default function Registration({ handleGoogleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  function handleRegistration() {
    createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      const user = userCredential.user;
      navigate("/")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  };

  function handleGoogleLogin(){
    signInWithPopup(auth, googleAuthProvider).then(result => {
      const credenetial = GoogleAuthProvider.credentialFromResult(result)
      const token = credenetial.accessToken;

      const user = result.user;
      console.log(user);
      navigate("/")
    }).catch(error => console.error(error))
  }

  return (
    <>
    <div className="popup-overlay">
      <div className="popup">
        <h2>Register</h2>
        <form>
          <input
            className='boxStyle'
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
          <input
            className='boxStyle'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <br />
          <button className='RegistartionsButton' type="button" onClick={handleRegistration}>Register</button>
          <p id='keinKontoText'>Bereits ein konto? <a href="/Login">Log in</a></p>
        </form>
        <button className='googleBtn' onClick={handleGoogleLogin}><i className="fab fa-google"></i> Google</button>
      </div>
    </div>
    </>
  );
};
