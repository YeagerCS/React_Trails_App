import React, { useState } from 'react';
import "./styles.css"

export default function Registration({ }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleregistration = () => {
    // Handle the login logic here
    
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
