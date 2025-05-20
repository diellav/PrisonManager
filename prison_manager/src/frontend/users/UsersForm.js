import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const UserForm = ({ editingUser, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address_: "",
    email: "",
    username: "",
    password_: "",
    photo: "",
    roleID: "",
  });

  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingUser) {
      setForm({
        first_name: editingUser.first_name || "",
        last_name: editingUser.last_name || "",
        date_of_birth: editingUser.date_of_birth?.split("T")[0] || "",
        gender: editingUser.gender || "",
        phone: editingUser.phone || "",
        address_: editingUser.address_ || "",
        email: editingUser.email || "",
        username: editingUser.username || "",
        password_: editingUser.password_ || "",
        photo: editingUser.photo || "",
        roleID: editingUser.roleID?.toString() || "",
      });
    }
  }, [editingUser]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/roles");
        setRoles(response.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5000/api/users/${editingUser.userID}`, form);
      } else {
        await axios.post("http://localhost:5000/api/users", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Failed to save user");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingUser ? "Edit User" : "Create User"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {[{ label: "First Name", name: "first_name" },
              { label: "Last Name", name: "last_name" },
              { label: "Date of Birth", name: "date_of_birth", type: "date" },
              { label: "Phone", name: "phone" },
              { label: "Address", name: "address_" },
              { label: "Email", name: "email", type: "email" },
              { label: "Username", name: "username" },
              { label: "Password", name: "password_", type: "password" },
              { label: "Photo URL", name: "photo" }]
              .map(({ label, name, type = "text" }) => (
                <div key={name} className="col-md-6 mb-3">
                  <label>{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

            <div className="col-md-6 mb-3">
              <label>Gender</label>
              <select className="form-control" name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>


            <div className="col-md-6 mb-3">
              <label>Role</label>
              <select className="form-control" name="roleID" value={form.roleID} onChange={handleChange} required>
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.roleID} value={role.roleID}>
                    {role.name_}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingUser ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
