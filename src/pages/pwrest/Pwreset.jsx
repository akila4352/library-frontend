import React, { useState, useEffect } from 'react';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpConfirmed, setIsOtpConfirmed] = useState(false); // New state for OTP confirmation

  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Simulate sending OTP via email
    const success = await sendOtpToEmail(email);
    
    if (success) {
      startTimer();
      setIsOtpSent(true);
    } else {
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleConfirmOTP = (e) => {
    e.preventDefault();
    // Verify OTP logic should go here. This is just a placeholder.
    if (otp === '123456') { // Replace this with your actual OTP verification logic
      alert('OTP confirmed. You can now reset your password.');
      setIsOtpConfirmed(true);
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    // Implement your logic to update the password in the database
    const success = await resetPassword(email, newPassword);
    
    if (success) {
      alert('Password reset successfully. You can now log in with your new password.');
      onClose(); // Close the modal after successful reset
    } else {
      alert('Failed to reset password. Please try again.');
    }
  };

  const sendOtpToEmail = async (email) => {
    console.log(`Sending OTP to ${email}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 2000)); // Simulate a delay
  };

  const resetPassword = async (email, newPassword) => {
    console.log(`Resetting password for ${email}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 2000)); // Simulate a delay
  };

  const startTimer = () => {
    setIsTimerActive(true);
    setSecondsLeft(60);

    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => prevSeconds - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setIsTimerActive(false);
    }, 60000);
  };

  useEffect(() => {
    if (isTimerActive && secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
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
                {isOtpSent ? (
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
                ) : null}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    {isOtpSent ? 'Confirm OTP' : 'Send OTP'}
                  </button>
                </div>
                {isOtpSent ? (
                  <div className="text-center mt-2">
                    {isTimerActive ? (
                      <p>Resend OTP in {secondsLeft} seconds</p>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setIsOtpSent(false)}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                ) : null}
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
