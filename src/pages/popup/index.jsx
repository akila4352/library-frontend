import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import supabase from '../../helper/superbaseClient'; 

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpConfirmed, setIsOtpConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null); // Store the OTP for verification

  // Send OTP to email through backend API
  const sendOtpToEmail = async (email) => {
    try {
      const response = await fetch('https://test2app-e9c794ac2195.herokuapp.com/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setGeneratedOtp(data.otp); // Store the OTP sent to the user
        return true;
      } else {
        setErrorMessage(data.message || 'Failed to send OTP');
        return false;
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('An error occurred while sending OTP. Please try again.');
      return false;
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email.');
      return;
    }
    const success = await sendOtpToEmail(email);
    if (success) {
      startTimer();
      setIsOtpSent(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Failed to send OTP. Please try again.');
    }
  };

  const handleConfirmOTP = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) { // Match entered OTP with generated OTP
      setIsOtpConfirmed(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const success = await resetPassword(email, hashedPassword);
    if (success) {
      alert('Password reset successfully. You can now log in with your new password.');
      onClose();
    } else {
      setErrorMessage('Failed to reset password. Please try again.');
    }
  };

  const resetPassword = async (email, hashedPassword) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('email', email);
      if (error) {
        console.error('Error updating password:', error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Password reset error:', error.message);
      return false;
    }
  };

  const startTimer = () => {
    setIsTimerActive(true);
    setSecondsLeft(60);
    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isTimerActive && secondsLeft === 0) {
      setIsTimerActive(false);
    }
  }, [isTimerActive, secondsLeft]);

  return (
    <div
      className={`modal ${isOpen ? 'show' : ''}`}
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Forgot Password</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {!isOtpConfirmed ? (
              <form onSubmit={isOtpSent ? handleConfirmOTP : handleSendOTP}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {isOtpSent && (
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">OTP</label>
                    <input
                      type="text"
                      className="form-control"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    {isOtpSent ? 'Confirm OTP' : 'Send OTP'}
                  </button>
                </div>
                {isOtpSent && (
                  <div className="text-center mt-2">
                    {isTimerActive ? (
                      <p>Resend OTP in {secondsLeft} seconds</p>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => {
                          setIsOtpSent(false);
                          setOtp('');
                          setErrorMessage('');
                        }}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <small className="form-text text-muted">
                    Your password should be at least 8 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters for better security.
                  </small>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
