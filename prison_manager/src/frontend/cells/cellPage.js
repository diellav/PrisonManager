import React, { useEffect, useState } from "react";
import axios from "axios";
import CellForm from "./CellForm";
import CellsList from "./CellsList";

const CellPage = () => {
  const [cells, setCells] = useState([]);
  const [form, setForm] = useState({
    block_name: "",
    cell_number: "",
    capacity: "",
    actual_capacity: "",
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

  useEffect(() => {
    fetchCells();
  }, []);

  const fetchCells = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cells", axiosConfig);
      setCells(res.data);
    } catch (err) {
      console.error("Error fetching cells:", err.response ? err.response.data : err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        block_name: form.block_name,
        cell_number: form.cell_number,
        capacity: parseInt(form.capacity),
        actual_capacity: parseInt(form.actual_capacity),
        category: form.category,
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/cells/${form.id}`, payload, axiosConfig);
      } else {
        await axios.post("http://localhost:5000/api/cells", payload, axiosConfig);
      }

      setForm({
        block_name: "",
        cell_number: "",
        capacity: "",
        actual_capacity: "",
        category: "",
        id: null,
      });
      setIsEditing(false);
      setShowForm(false);
      fetchCells();
    } catch (err) {
      console.error("Error saving cell:", err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (cell) => {
    setForm({
      block_name: cell.block_name,
      cell_number: cell.cell_number,
      capacity: cell.capacity,
      actual_capacity: cell.actual_capacity,
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
        console.error("Error deleting cell:", err.response ? err.response.data : err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    setForm({
      block_name: "",
      cell_number: "",
      capacity: "",
      actual_capacity: "",
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
      />

      <CellsList
        cells={cells}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleGoToCreate}
      />
    </div>
  );
};

export default CellPage;
