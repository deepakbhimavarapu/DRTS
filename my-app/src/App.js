import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    // Prepare the request body
    const requestBody = {
      name,
      email,
      phone,
      password
    };
    

    // Make the API call
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMessage(data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1>Registration Form</h1>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button onClick={handleRegister}>Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
