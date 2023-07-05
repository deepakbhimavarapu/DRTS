import React, { useState, useEffect } from 'react';

const Dashboard = ({ email, handleLogout, balance, handleTransaction, transactions }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Extract the form data
    const formData = {
      account: event.target.account.value,
      amount: event.target.amount.value,
    };
    // Call the handleTransaction function with the form data
    handleTransaction(formData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.centerDiv}>
        <h1>Welcome to the Dashboard!</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="account">Account:</label>
            <input type="text" id="account" name="account" required />
          </div>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input type="text" id="amount" name="amount" required />
          </div>
          <button type="submit">Submit</button>
        </form>
        <div style={styles.transactionTable}>
          <h2>Transaction Details</h2>
          {Array.isArray(transactions) && transactions.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Sender ID</th>
                        <th>Receiver ID</th>
                        <th>Amount</th>
                        <th>Date_time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td>{transaction.senderid}</td>
                          <td>{transaction.receiverid}</td>
                          <td>{transaction.amount}</td>
                          <td>{transaction.date_time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No transactions found.</p>
                )}
        </div>
      </div>
      <div style={styles.rightDiv}>
        <p>Email: {email}</p>
        <p>Balance: {balance}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;

const styles = {
  container: {
    display: 'flex',
  },
  centerDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '300px',
  },
  transactionTable: {
    marginTop: '20px',
  },
  rightDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    margin: '20px',
  },
};
