import React from 'react';

const RegisterPage = ({ handleRegister }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Extract the form data
    const formData = {
      name: event.target.name.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      account: event.target.account.value,
      password: event.target.password.value,
    };
    // Call the handleRegister function with the form data
    handleRegister(formData);
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input type="tel" id="phone" name="phone" required />
        </div>
        <div>
          <label htmlFor="account">Account:</label>
          <input type="text" id="account" name="account" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
