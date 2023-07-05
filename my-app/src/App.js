import React, { useState, useEffect } from 'react';
import RegisterPage from './RegisterPage';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

import './App.css';

const App = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [LoggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({ email: '' , balance:0, transactions:''});


  useEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userEmail = localStorage.getItem('userEmail');
  const balance = localStorage.getItem('balance');
  const transactions = JSON.parse(localStorage.getItem('transactions'));
  

  if (isLoggedIn === 'true' && userEmail) {
    setLoggedIn(true);
    setLoggedInUser({ email: userEmail, balance: balance, transactions:transactions['rows']});
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

const handleTransaction = async (formData) => {
  formData["email"] = loggedInUser.email;
  console.log(formData)
  try {
    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    alert("Transactions successful")
    setLoggedInUser({ email: loggedInUser.email, balance: data.balance, transactions:data.transactions['rows']});
    localStorage.setItem('balance', data.balance);
    localStorage.setItem('transactions', JSON.stringify(data.transactions));
  } catch (error) {
    console.error(error);
    // Display an error message if the registration fails
    alert('Transfer failed');
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
      
      // setUserBalance(data.balance)
      const isLoggedIn = data.message;

      if (isLoggedIn) {
        // Store the login state in local storage
        localStorage.setItem('isLoggedIn', 'true');
        // Store the login state in session storage
        sessionStorage.setItem('isLoggedIn', 'true');
        // You can also store additional user data if needed
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('balance', data.balance);
        localStorage.setItem('transactions', JSON.stringify(data.transactions));
        // Redirect to the Dashboard component
        setShowRegister(false);
        setShowLogin(false);
        setLoggedIn(true);

        setLoggedInUser({ email: formData.email , balance:data.balance, transactions:data.transactions['rows']});
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
    
    if (isLoggedOut) {
      setLoggedIn(false);
      setLoggedInUser({ email: '', balance: 0, transactions:''});
      
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('balance');
      localStorage.removeItem('transactions');

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

    {!showRegister && !showLogin && !LoggedIn &&(
      <div>
        <button onClick={() => setShowRegister(true)}>Signup</button>
        <button onClick={() => setShowLogin(true)}>Login</button>
      </div>
    )}
    {showRegister && <RegisterPage handleRegister={handleRegister} />}
    {showLogin && <LoginForm handleLogin={handleLogin} />}
    {LoggedIn && <Dashboard email={loggedInUser.email} handleLogout={handleLogout} handleTransaction={handleTransaction} balance={loggedInUser.balance} transactions={loggedInUser.transactions}/>}
  </div>
);
};

export default App;
