import React, { useState } from 'react';

const LoginPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTogglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = () => {
    // Handle the login logic here
    // You can make an API call, update state, etc.
    // For simplicity, we'll just console.log for now
    console.log('Login logic goes here');
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={handleTogglePopup}>Login</button>

      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Login</h2>
            {/* Add your login form elements here */}
            <form>
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Password" />
              <button type="submit" onClick={handleLogin}>
                Submit
              </button>
            </form>
            <button onClick={handleTogglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPopup;


