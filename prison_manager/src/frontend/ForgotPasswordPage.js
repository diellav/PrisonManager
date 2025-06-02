import React, { useState } from 'react';
import axiosInstance from './axios';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setMessage('Email has been sent. Please check your inbox.');
    } catch (err) {
      setError('We could not find an account with that email.');
    }
  };

  return (
    <div className="bg-gradient-primary" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-9">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-0">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">Forgot Your Password?</h1>
                  </div>
                  <form className="user" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control form-control-user"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-user btn-block">
                      Send Reset Link
                    </button>
                    {message && (
                      <p className="text-success text-center mt-3">{message}</p>
                    )}
                    {error && (
                      <p className="text-danger text-center mt-3">{error}</p>
                    )}
                  </form>
                  <hr />
                  <div className="text-center">
                    <a className="small" href="/login">Back to Login</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
