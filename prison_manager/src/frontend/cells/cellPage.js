import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import CellForm from "./CellForm";
import CellList from "./CellsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const CellPage = () => {
  const [cells, setCells] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState({
    cell_number: "",
    capacity: "",
    actual_capacity: "",
    block_id: "",
    category: "",
    id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("cells.read")) fetchCells();
    if (hasPermission("cells.create") || hasPermission("cells.edit")) fetchBlocks();
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchCells = async () => {
    try {
      const res = await axiosInstance.get("/cells");
      setCells(res.data);
    } catch (err) {
      console.error("Error fetching cells:", err);
      setError("Error fetching cells.");
    }
  };

  const fetchBlocks = async () => {
    try {
      const res = await axiosInstance.get("/blocks");
      setBlocks(res.data);
    } catch (err) {
      console.error("Error fetching blocks:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "block_id") {
      const block = blocks.find((b) => b.block_id === parseInt(value));
      setForm((prev) => ({ ...prev, category: block?.category || "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const category = blocks.find(
      (block) => block.block_id === parseInt(form.block_id)
    )?.category || "";

    const payload = {
      cell_number: form.cell_number,
      capacity: parseInt(form.capacity),
      actual_capacity: parseInt(form.actual_capacity),
      block_id: parseInt(form.block_id),
      category,
    };

    try {
      if (isEditing && hasPermission("cells.edit")) {
        await axiosInstance.put(`/cells/${form.id}`, payload);
      } else if (!isEditing && hasPermission("cells.create")) {
        await axiosInstance.post("/cells", payload);
      } else {
        return showAlert("You don't have permission to perform this action.", "danger");
      }

      onSuccess();
    } catch (err) {
      showAlert("Failed to save cell. Please try again.", "danger");
      console.error("Error saving cell:", err);
      setError("Failed to save cell.");
    }
  };

  const handleEdit = (cell) => {
    if (!hasPermission("cells.edit")) {
      return showAlert("You don't have permission to edit cells.", "danger");
    }

    setForm({
      cell_number: cell.cell_number,
      capacity: cell.capacity,
      actual_capacity: cell.actual_capacity,
      block_id: cell.block_id,
      category: cell.category,
      id: cell.cell_block_ID,
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!hasPermission("cells.delete")) {
      return showAlert("You don't have permission to delete cells.", "danger");
    }

    try {
      await axiosInstance.delete(`/cells/${id}`);
      fetchCells();
    } catch (err) {
      showAlert("Failed to delete cell.", "danger");
      console.error("Error deleting cell:", err.response?.data || err.message);
    }
  };

  const goToCreate = () => {
    if (!hasPermission("cells.create")) {
      return showAlert("You don't have permission to create cells.", "danger");
    }

    setForm({
      cell_number: "",
      capacity: "",
      actual_capacity: "",
      block_id: "",
      category: "",
      id: null,
    });
    setIsEditing(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSuccess = () => {
    setShowForm(false);
    fetchCells();
  };

  const onCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Cell Management</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {(hasPermission("cells.create") || hasPermission("cells.edit")) && (
        <CellForm
          showModal={showForm}
          handleClose={handleClose}
          form={form}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          blocks={blocks}
        />
      )}

      {hasPermission("cells.read") && (
        <CellList
          cells={cells}
          blocks={blocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleGoToCreate}
        />
      )}
    </div>
  );
};

export default CellPage;
