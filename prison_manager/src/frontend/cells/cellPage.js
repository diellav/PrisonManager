import React, { useEffect, useState } from "react";
import axios from "axios";
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

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchCells = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cells", axiosConfig);
      setCells(res.data);
    } catch (err) {
      console.error("Error fetching cells:", err.response?.data || err.message);
    }
  };

  const fetchBlocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blocks");
      setBlocks(res.data);
    } catch (err) {
      console.error("Error fetching blocks:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCells();
    fetchBlocks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const category = blocks.find(block => block.block_id === parseInt(form.block_id))?.category || "";
  
      const payload = {
        cell_number: form.cell_number,
        capacity: parseInt(form.capacity),
        actual_capacity: parseInt(form.actual_capacity),
        block_id: parseInt(form.block_id),
        category: category,,
      };
  
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/cells/${form.id}`, payload, axiosConfig);
      } else {
        await axios.post("http://localhost:5000/api/cells", payload, axiosConfig);
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
      setShowForm(false);
      fetchCells();
    } catch (error) {
      console.error("Error saving cell:", error.response?.data || error.message);
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
        await axios.delete(`http://localhost:5000/api/cells/${id}`, axiosConfig);
        fetchCells(); 
      } catch (err) {
        console.error("Error deleting cell:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
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
