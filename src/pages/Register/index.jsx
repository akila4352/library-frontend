import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import './index.css';
import image2 from './cbak2.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Validate the password strength
  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Validate email format to accept only Gmail addresses
  const validateEmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validatePassword(formData.password)) {
      setPasswordError('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    } else {
      setPasswordError('');
    }
  
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid Gmail address.');
      return;
    } else {
      setEmailError('');
    }
  
    try {
      const response = await fetch('https://your-heroku-app-url/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setRegistrationMessage(result.message || 'Registration successful!');
      } else {
        setRegistrationMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setRegistrationMessage('An unexpected error occurred during registration.');
    }
  };
  

  return (
    <div>
      <div className="container-fluid bg-dark text-light py-3">
        <header className="text-center">
          <h1 className="display-6">Welcome to our page</h1>
        </header>
      </div>
      <div className="container my-2 bg-dark text-light p-2">
        <div className="row">
          <div className="col-md-6 d-none d-md-block">
            <img src={image2} alt="background" className="ful" />
          </div>
          <div className="col-md-6">
            <section className="container w-100 text-light p-2">
              <form className="row g-3 p-3" onSubmit={handleSubmit}>
                {/* Input fields */}
                {/* First Name */}
                <div className="col-md-4">
                  <label htmlFor="firstName" className="form-label">First name</label>
                  <input type="text" className="form-control" id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                {/* Last Name */}
                <div className="col-md-4">
                  <label htmlFor="lastName" className="form-label">Last name</label>
                  <input type="text" className="form-control" id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                {/* Username */}
                <div className="col-md-4">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" className="form-control" id="username" value={formData.username} onChange={handleInputChange} required />
                </div>
                {/* Email */}
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" value={formData.email} onChange={handleInputChange} required />
                  {emailError && <small className="text-danger">{emailError}</small>}
                </div>
                {/* Password */}
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" value={formData.password} onChange={handleInputChange} required />
                  {passwordError && <small className="text-danger">{passwordError}</small>}
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input type="text" className="form-control" id="address" value={formData.address} onChange={handleInputChange} placeholder="1234 Main St" required />
                </div>
                <div className="col-12">
                  <label htmlFor="address2" className="form-label">Address 2</label>
                  <input type="text" className="form-control" id="address2" value={formData.address2} onChange={handleInputChange} placeholder="Apartment, studio, or floor" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">City</label>
                  <input type="text" className="form-control" id="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">State</label>
                  <select id="state" className="form-select" value={formData.state} onChange={handleInputChange} required>
                    <option value="" disabled>Choose...</option>
                    <option>Central</option>
                    <option>Eastern</option>
                    <option>North Central</option>
                    <option>Northern</option>
                    <option>North Western</option>
                    <option>Sabaragamuwa</option>
                    <option>Southern</option>
                    <option>Uva</option>
                    <option>Western</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label htmlFor="zip" className="form-label">Zip</label>
                  <input type="text" className="form-control" id="zip" value={formData.zip} onChange={handleInputChange} required />
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="gridCheck" required />
                    <label className="form-check-label" htmlFor="gridCheck">Check me out</label>
                  </div>
                </div>
                {/* Submit */}
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <button type="submit" className="btn btn-primary mx-2">Register</button>
                </div>
                {registrationMessage && <p className="text-center">{registrationMessage}</p>}
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
