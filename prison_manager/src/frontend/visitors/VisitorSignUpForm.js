import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

function SignUpVisitor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axiosInstance.post('/visitors/signup', formData);
      console.log('Sign up successful, redirecting...');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Visitor Sign Up</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            name="first_name"
            type="text"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            name="last_name"
            type="text"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            type="text"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpVisitor;
