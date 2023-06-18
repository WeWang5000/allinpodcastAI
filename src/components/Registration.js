import React from 'react';
import '../components/Registration.css';

const Registration = () => {
  return (
    <div className="registration-container">
      <h2 className="registration-title">Registration Form</h2>
      <form className="registration-form">
        <input className="registration-input" type="text" placeholder="First Name" />
        <input className="registration-input" type="text" placeholder="Last Name" />
        <input className="registration-input" type="email" placeholder="Email" />
        <input className="registration-input" type="password" placeholder="Password" />
        <button className="registration-button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;
