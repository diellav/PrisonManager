import React, { useEffect, useState } from "react";
import axios from "axios";

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", id: null });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err.response ? err.response.data : err.message);
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
        await axios.put(`http://localhost:5000/api/roles/${form.id}`, {
          name: form.name,
          description: form.description,
        });
      } else {
        await axios.post("http://localhost:5000/api/roles", {
          name: form.name,
          description: form.description,
        });
      }
      setForm({ name: "", description: "", id: null });
      setIsEditing(false);
      fetchRoles();
    } catch (err) {
      console.error("Error saving role:", err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (role) => {
    setForm({ name: role.name_, description: role.description_, id: role.roleID });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`http://localhost:5000/api/roles/${id}`);
        fetchRoles();
      } catch (err) {
        console.error("Error deleting role:", err.response ? err.response.data : err.message);
      }
    }
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Role" : "Create Role"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Role Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isEditing ? "Update" : "Create"}</button>
      </form>

      <h2>Roles List</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.roleID}>
              <td>{role.roleID}</td>
              <td>{role.name_}</td>
              <td>{role.description_}</td>
              <td>
                <button onClick={() => handleEdit(role)}>Edit</button>
                <button onClick={() => handleDelete(role.roleID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolePage;
