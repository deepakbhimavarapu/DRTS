import React from 'react';

const Dashboard = ({ email, handleLogout }) => {
  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <p>Email: {email}</p>
      <p>Balance: $100</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
