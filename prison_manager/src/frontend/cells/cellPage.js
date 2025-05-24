import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import CellForm from "./CellForm";
import CellList from "./CellsList";

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

  useEffect(() => {
    fetchCells();
    fetchBlocks();
  }, []);

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
    try {
      const payload = {
        cell_number: form.cell_number,
        capacity: parseInt(form.capacity),
        actual_capacity: parseInt(form.actual_capacity),
        block_id: parseInt(form.block_id),
        category: form.category,
      };

      if (isEditing) {
        await axiosInstance.put(`/cells/${form.id}`, payload);
      } else {
        await axiosInstance.post("/cells", payload);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving cell:", err);
      setError("Failed to save cell.");
    }
  };

  const handleEdit = (cell) => {
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
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cell?")) {
      try {
        await axiosInstance.delete(`/cells/${id}`);
        fetchCells();
      } catch (err) {
        console.error("Error deleting cell:", err);
        setError("Failed to delete cell.");
      }
    }
  };

  const goToCreate = () => {
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
      <h2 className="mb-4">Cells Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {showForm ? (
        <CellForm
          form={form}
          blocks={blocks}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          onCancel={onCancel}
        />
      ) : (
        <CellList
          cells={cells}
          blocks={blocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={goToCreate}
        />
      )}
    </div>
  );
};

export default CellPage;
