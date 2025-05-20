import React,{ useEffect, useState } from "react";
import axios from "axios";
import RoleForm from "./RoleForm";
import RolesList from "./RolesList";

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false); // Mbyll modal-in pas submit
      fetchRoles();
    } catch (err) {
      console.error("Error saving role:", err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (role) => {
    setForm({ name: role.name_, description: role.description_, id: role.roleID });
    setIsEditing(true);
    setShowForm(true);
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

  const handleGoToCreate = () => {
    setForm({ name: "", description: "", id: null });
    setIsEditing(false);
    setShowForm(true); // Hap modal për create
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = () => setShowForm(false);

  return (
    <div className="container mt-4">
      <RoleForm
        showModal={showForm}
        handleClose={handleClose}
        form={form}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      <RolesList
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleGoToCreate}
      />
    </div>
  );
};

export default RolePage;
