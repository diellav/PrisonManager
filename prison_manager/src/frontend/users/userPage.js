import React, { useEffect, useState } from "react";
import axiosInstance from "../axios"; 
import UserForm from "./UsersForm";
import UsersList from "./UsersList";
import UserForm from "./UsersForm";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
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
      id: null,
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = { ...form };

    if (isEditing) {
      if (!payload.password_) {
        delete payload.password_;
      }
      await axiosInstance.put(`/users/${form.id}`, payload);
    } else {
      await axiosInstance.post("/users", payload);
    }
    resetForm();
    fetchUsers();
  } catch (err) {
    console.error("Error saving user:", err.response?.data || err.message);
  }
};


  const getRoleName = (roleID) => {
    const role = roles.find((r) => r.roleID === roleID);
    return role ? role.name_ : "Unknown";
  };

  const goToCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const onEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const onDelete = async (userID) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    try {
      await axiosInstance.delete(`/users/${userID}`);
      setUsers(users.filter((user) => user.userID !== userID));
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
      setError("Failed to delete user.");
    }
  }
};


  const onSuccess = () => {
    setShowForm(false);
    fetchUsers();
  };

  const onCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <h2>Users Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm ? (
        <UserForm editingUser={editingUser} onSuccess={onSuccess} onCancel={onCancel} />
      ) : (
        <UsersList
          users={users}
          onEdit={onEdit}
          onDelete={onDelete}
          goToCreate={goToCreate}
          getRoleName={getRoleName}
        />
      )}
    </div>
  );
};

export default UsersPage;
