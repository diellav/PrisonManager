import React, { useState, useEffect } from "react";
import axios from "axios";
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
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      setRoles(response.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
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
      await axios.delete(`http://localhost:5000/api/users/${userID}`);
      setUsers(users.filter((user) => user.userID !== userID));
    } catch (err) {
      console.error("Error deleting user:", err.response ? err.response.data : err.message);
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
