import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./UsersForm";
import UsersList from "./UsersList";

const UserPage = () => {
  const [users, setUsers] = useState([]);
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
    id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response ? err.response.data : err.message);
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
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/users/${form.id}`, form);
      } else {
        await axios.post("http://localhost:5000/api/users", form);
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (user) => {
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      date_of_birth: user.date_of_birth?.split("T")[0] || "",
      gender: user.gender,
      phone: user.phone,
      address_: user.address_,
      email: user.email,
      username: user.username,
      password_: user.password_,
      photo: user.photo,
      roleID: user.roleID,
      id: user.userID,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err.response ? err.response.data : err.message);
      }
    }
  };

  const handleModalOpen = () => {
    resetForm();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <UserForm
        showModal={showModal}
        handleClose={handleModalClose}
        form={form}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      <UsersList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleModalOpen}
      />
    </div>
  );
};

export default UserPage;
