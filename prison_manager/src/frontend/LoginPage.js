import React, { useState } from 'react';
import axiosInstance from './axios'; 
import {jwtDecode} from 'jwt-decode'; 
import { Link, useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });

      const { token, permissions } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('permissions', JSON.stringify(permissions || []));

 
      try {
        const validateRes = await axiosInstance.get('/auth/validate');
        const user = validateRes.data.user;

        const decoded = jwtDecode(token);
        localStorage.setItem('userType', decoded.type || user.userType || '');

  
        onLogin(user);

  
        const userType = decoded.type || user.userType;
          if (userType === 'visitor') {
            navigate('/visitor-dashboard', { replace: true });
          } else {
            navigate('/profile', { replace: true });
          }

      } catch (validationError) {
        console.error("Token validation failed:", validationError);
        setErrorMessage("Login failed during validation.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="bg-gradient-primary" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image" />
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Welcome!</h1>
                      </div>
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control form-control-user"
                            placeholder="Username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          Login
                        </button>
                        {errorMessage && (
                          <p className="text-danger text-center mt-2">{errorMessage}</p>
                        )}
                      </form>
                      <hr />
                      <div className="text-center">
                        <Link className="small" to="/forgot-password">Forgot Password?</Link>
                      </div>
                      <div className="mt-3 text-center">
                        <span>Don’t have an account? </span>
                        <Link to="/visitor-signup" className="small">
                          Sign Up
                        </Link>
                      </div>
                    </div>
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

export default LoginPage;
