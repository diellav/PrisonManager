import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/users/${form.id}`, form);
      } else {
        await axios.post("http://localhost:5000/api/users", form);
      }
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

  return (
    <div>
      <h2>{isEditing ? "Edit User" : "Create User"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" value={form.first_name} onChange={handleInputChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleInputChange} required />
        <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleInputChange} required />
        <input type="text" name="gender" placeholder="Gender" value={form.gender} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleInputChange} required />
        <input type="text" name="address_" placeholder="Address" value={form.address_} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleInputChange} required />
        <input type="password" name="password_" placeholder="Password" value={form.password_} onChange={handleInputChange} required />
        <input type="text" name="photo" placeholder="Photo URL" value={form.photo} onChange={handleInputChange} required />
        <input type="number" name="roleID" placeholder="Role ID" value={form.roleID} onChange={handleInputChange} required />
        <button type="submit">{isEditing ? "Update" : "Create"}</button>
      </form>

      <h2>Users List</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Birthdate</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Email</th>
            <th>Username</th>
            <th>Photo</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td>{user.userID}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.date_of_birth?.split("T")[0]}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{user.address_}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td><img src={user.photo} alt="user" width="50" /></td>
              <td>{user.roleID}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.userID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPage;
