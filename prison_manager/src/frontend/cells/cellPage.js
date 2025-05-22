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

  useEffect(() => {
    fetchCells();
    fetchBlocks();
  }, []);

  const fetchCells = async () => {
    try {
      const res = await axiosInstance.get("/cells");
      setCells(res.data);
    } catch (err) {
      console.error("Error fetching cells:", err.response?.data || err.message);
    }
  };

  const fetchBlocks = async () => {
    try {
      const res = await axiosInstance.get("/blocks");
      setBlocks(res.data);
    } catch (err) {
      console.error("Error fetching blocks:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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

      if (isEditing) {
        await axiosInstance.put(`/cells/${form.id}`, payload);
      } else {
        await axiosInstance.post("/cells", payload);
      }

      resetForm();
      fetchCells();
    } catch (err) {
      console.error("Error saving cell:", err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setForm({
      cell_number: "",
      capacity: "",
      actual_capacity: "",
      block_id: "",
      category: "",
      id: null,
    });
    setIsEditing(false);
    setShowForm(false);
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
        console.error("Error deleting cell:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = () => setShowForm(false);

  return (
    <div className="container mt-4">
      <CellForm
        showModal={showForm}
        handleClose={handleClose}
        form={form}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        blocks={blocks}
      />

      <CellList
        cells={cells}
        blocks={blocks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleGoToCreate}
      />
    </div>
  );
};

export default CellPage;
