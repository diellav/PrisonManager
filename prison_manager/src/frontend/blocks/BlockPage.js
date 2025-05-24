import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import BlocksList from "./BlocksList";
import BlockForm from "./BlockForm";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const BlockPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState({ block_name: "", category: "", block_id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("blocks.read")) {
      fetchBlocks();
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchBlocks = async () => {
    try {
      const res = await axiosInstance.get("/blocks");
      setBlocks(res.data);
    } catch (err) {
      console.error("Error fetching blocks:", err.response?.data || err.message);
      showAlert("Failed to fetch blocks.", "danger");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing && !hasPermission("blocks.edit")) {
      return showAlert("You don't have permission to edit blocks.", "danger");
    }
    if (!isEditing && !hasPermission("blocks.create")) {
      return showAlert("You don't have permission to create blocks.", "danger");
    }

    try {
      if (isEditing) {
        await axiosInstance.put(`/blocks/${form.block_id}`, {
          block_name: form.block_name,
          category: form.category,
        });
      } else {
        await axiosInstance.post("/blocks", {
          block_name: form.block_name,
          category: form.category,
        });
      }
      setShowForm(false);
      fetchBlocks();
      resetForm();
    } catch (err) {
      if (err.response?.status === 403) {
        showAlert("Access denied: You do not have the required permission.", "danger");
      } else {
        showAlert("Failed to save block. Please try again.", "danger");
      }
      console.error("Error saving block:", err.response?.data || err.message);
    }
  };

  const handleEdit = (block) => {
    if (!hasPermission("blocks.edit")) {
      alert("No permission to edit blocks.");
      return;
    }
    setForm({
      block_name: block.block_name,
      category: block.category,
      block_id: block.block_id,
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!hasPermission("blocks.delete")) {
      return showAlert("No permission to delete blocks.", "danger");
    }
    if (!window.confirm("Are you sure you want to delete this block?")) return;

    try {
      await axiosInstance.delete(`/blocks/${id}`);
      fetchBlocks();
    } catch (err) {
      showAlert("Failed to delete block.", "danger");
      console.error("Error deleting block:", err.response?.data || err.message);
    }
  };

  const handleGoToCreate = () => {
    if (!hasPermission("blocks.create")) {
      return showAlert("No permission to create blocks.", "danger");
    }
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({ block_name: "", category: "", block_id: null });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Block Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {(hasPermission("blocks.create") || hasPermission("blocks.edit")) && (
        <BlockForm
          showModal={showForm}
          handleClose={() => setShowForm(false)}
          form={form}
          handleInputChange={handleInputChange}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
        />
      )}

      {hasPermission("blocks.read") && (
        <BlocksList
          blocks={blocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleGoToCreate}
        />
      )}
    </div>
  );
};

export default BlockPage;
