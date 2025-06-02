import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import CellForm from "./CellForm";
import CellList from "./CellsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const initialFormState = {
  id: null,
  block_id: "",
  cell_number: "",
  capacity: "",
  actual_capacity: "",
  category: ""
};

const CellPage = () => {
  const [cells, setCells] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState(initialFormState);
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

    const selectedBlock = blocks.find(
      (block) => block.block_id === cell.block_id
    );

    setForm({
      id: cell.cell_block_ID,
      block_id: cell.block_id,
      cell_number: cell.cell_number,
      capacity: cell.capacity,
      actual_capacity: cell.actual_capacity,
      category: selectedBlock ? selectedBlock.category : ""
    });

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

    setForm(initialFormState);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setForm(initialFormState);
    setIsEditing(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "block_id") {
      const selectedBlock = blocks.find(
        (block) => block.block_id === parseInt(value)
      );
      setForm((prevForm) => ({
        ...prevForm,
        block_id: value,
        category: selectedBlock ? selectedBlock.category : ""
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value
      }));
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isEditing && !hasPermission("cells.edit")) {
    return showAlert("You don't have permission to edit cells.", "danger");
  }
  if (!isEditing && !hasPermission("cells.create")) {
    return showAlert("You don't have permission to create cells.", "danger");
  }

  try {
    if (isEditing) {
      const updatedForm = {
        ...form,
        block_id: parseInt(form.block_id),
        capacity: parseInt(form.capacity),
        actual_capacity: parseInt(form.actual_capacity),
      };

      await axiosInstance.put(`/cells/${parseInt(form.id)}`, updatedForm);
    } else {
      await axiosInstance.post("/cells", form);
    }

    setForm(initialFormState);
    setIsEditing(false);
    setShowModal(false);
    fetchCells();
  } catch (err) {
    showAlert("Failed to save cell. Please try again.", "danger");
    console.error("Error saving cell:", err.response?.data || err.message);
  }
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
          form={form}
          blocks={blocks}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
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
