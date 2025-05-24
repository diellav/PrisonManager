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
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("cells.read")) {
      fetchCells();
    } else {
      showAlert("You don't have permission to view cells.", "danger");
      setLoading(false);
    }

    if (hasPermission("cells.create") || hasPermission("cells.edit")) {
      fetchBlocks();
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchCells = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/cells");
      setCells(res.data);
    } catch (err) {
      console.error("Error fetching cells:", err);
      showAlert("Failed to fetch cells.", "danger");
    } finally {
      setLoading(false);
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

  const handleEdit = (cell) => {
    if (!hasPermission("cells.edit")) {
      return showAlert("You don't have permission to edit cells.", "danger");
    }

    setForm(cell);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("cells.delete")) {
      return showAlert("You don't have permission to delete cells.", "danger");
    }

    try {
      await axiosInstance.delete(`/cells/${id}`);
      fetchCells();
    } catch (err) {
      console.error("Error deleting cell:", err.response?.data || err.message);
      showAlert("Failed to delete cell.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("cells.create")) {
      return showAlert("You don't have permission to create cells.", "danger");
    }

    setForm(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setForm(null);
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2>Cell Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <CellForm
          editingCell={isEditing ? form : null}
          blocks={blocks}
          onSuccess={() => {
            setShowModal(false);
            fetchCells();
            setIsEditing(false);
            setForm(null);
          }}
          onCancel={handleModalClose}
        />
      ) : hasPermission("cells.read") ? (
        <CellList
          cells={cells}
          blocks={blocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
        />
      ) : (
        <p>You do not have permission to view cells.</p>
      )}
    </div>
  );
};

export default CellPage;
