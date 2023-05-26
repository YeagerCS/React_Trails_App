import React, { useState } from 'react';
import "./styles.css"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { returnAuth } from "./fire"
import { useNavigate } from 'react-router-dom';

export default function Registration({ }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleregistration = () => {
    const auth = returnAuth();
    createUserWithEmailAndPassword(auth, username, password)
  .then((userCredential) => {
    console.log("registered")
    const user = userCredential.user;
    navigate("/")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  };

  return (
    <>
    <div className="popup-overlay">
      <div className="popup">
        <h2>Register</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <br />
          <button className='RegistartionsButton' type="button" onClick={handleregistration}>Register</button>
          <a href='/'><button className='CloseButton' type="button">Close</button></a>
        </form>
      </div>
    </div>
    </>
  );
};
