import React, { useState, useEffect } from 'react';
import RegisterPage from './RegisterPage';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

import './App.css';

const App = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [LoggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({ email: '' });

  useEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userEmail = localStorage.getItem('userEmail');

  if (isLoggedIn === 'true' && userEmail) {
    setLoggedIn(true);
    setLoggedInUser({ email: userEmail });
  }
  }, []);


  const handleRegister = async (formData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      const data = await response.json();
      // Display the success message received from the backend
      alert(data.message);
      setShowRegister(false)
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error(error);
    // Display an error message if the registration fails
    alert('Registration failed');
  }
};

const handleLogin = async (formData) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      const isLoggedIn = data.message;

      if (isLoggedIn) {
        // Store the login state in local storage
        localStorage.setItem('isLoggedIn', 'true');
        // Store the login state in session storage
        sessionStorage.setItem('isLoggedIn', 'true');
        // You can also store additional user data if needed
        localStorage.setItem('userEmail', formData.email);
        // Redirect to the Dashboard component
        setShowRegister(false);
        setShowLogin(false);
        setLoggedIn(true);

        setLoggedInUser({ email: formData.email });
      } else {
        alert('Invalid email or password');
      }
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error(error);
    alert('Login failed');
  }
};

  const handleLogout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const isLoggedOut = data.message;
    alert(data.message)
    if (isLoggedOut) {
      setLoggedIn(false);
      setLoggedInUser({ email: '' });
      alert('user loggedout')
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');

    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error(error);
    alert('Logout failed');
  }
};


  const handleSignup = () => {
    setShowRegister(true);
  };

  const handleSignin = () => {
    // Handle the login functionality
    setShowLogin(true);
    
  };

  return (
  <div className="App">
    <h1>My App</h1>
    {!showRegister && !showLogin && !LoggedIn &&(
      <div>
        <button onClick={() => setShowRegister(true)}>Signup</button>
        <button onClick={() => setShowLogin(true)}>Login</button>
      </div>
    )}
    {showRegister && <RegisterPage handleRegister={handleRegister} />}
    {showLogin && <LoginForm handleLogin={handleLogin} />}
    {LoggedIn && <Dashboard email={loggedInUser.email} handleLogout={handleLogout} />}
  </div>
);
};

export default App;
