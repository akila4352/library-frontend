import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../popup'; // Ensure this is the correct path
import supabase from '../../helper/superbaseClient'; // Ensure this is the correct path
import bcrypt from 'bcryptjs';
import { useUser } from '../User/UserContext'; // Import the UserContext
import './index.css';
import emailIcon from './email.png';
import passIcon from './password.png';
import image2 from './cbak2.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Get setUser from context
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user'); // New state for user type

  const toggleForgotPassword = () => {
    setForgotPasswordOpen(!forgotPasswordOpen);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sanitizeInput = (input) => {
    return input.replace(/<[^>]*>/g, ''); // Simple XSS prevention
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    
    if (!validateEmail(sanitizedEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          password: sanitizedPassword,
          userType: userType,  // Send user type as part of the request
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // If login is successful, set user in context and navigate
        setUser(result.firstName);
        navigate(userType === 'admin' ? '/adminpanel' : '/User');
      } else {
        alert(result.message);  // Show error message from backend
      }
    } catch (error) {
      console.error('Login error:', error.message);
      alert('Something went wrong! Please try again.');
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
            <img src={image2} alt="background" className="img-fluid" />
          </div>
          <div className="col-md-6">
            <section className="container w-100 text-light p-2">
              <form className="row g-3 p-3" onSubmit={handleSubmit}>
                <div className="col-md-12">
                  <label htmlFor="inputEmail4" className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <img src={emailIcon} alt="email" />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="inputEmail4"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputPassword4" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <img src={passIcon} alt="password" />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="inputPassword4"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {/* User Type Dropdown */}
                <div className="col-md-12">
                  <label htmlFor="userType" className="form-label">User Type</label>
                  <select
                    id="userType"
                    className="form-select"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="col-12">
                  <p className="text-center">
                    <a href="#" onClick={toggleForgotPassword}>
                      Forgot Password?
                    </a>
                  </p>
                </div>
                <div className="col-12 d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary mx-2">Log in</button>
                  <a href="/" className="btn btn-primary mx-2 text-decoration-none">Exit</a>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
      <ForgotPasswordModal isOpen={forgotPasswordOpen} onClose={toggleForgotPassword} />
    </div>
  );
};

export default Login;
