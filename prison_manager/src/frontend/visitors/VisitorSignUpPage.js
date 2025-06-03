import React, { useState } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

const VisitorSignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    email: "",
    relationship: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await axiosInstance.post("/visitors/signup", formData);
      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        email: "",
        relationship: "",
      });


      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to sign up. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Visitor Sign Up</h4>
        </div>
        <div className="card-body">
          {success && (
            <div className="alert alert-success" role="alert">
              You have signed up successfully!
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: "First Name", name: "first_name", type: "text", required: true },
              { label: "Last Name", name: "last_name", type: "text", required: true },
              { label: "Username", name: "username", type: "text", required: true },
              { label: "Password", name: "password", type: "password", required: true },
              { label: "Email", name: "email", type: "email", required: true },
              { label: "Relationship", name: "relationship", type: "text", required: true },
            ].map(({ label, name, type, required }) => (
              <div className="mb-3" key={name}>
                <label htmlFor={name} className="form-label">
                  {label}
                </label>
                <input
                  type={type}
                  className="form-control"
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                />
              </div>
            ))}

            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitorSignUpPage;
