import React, { useEffect, useState } from "react";
import axios from "axios";

const CellPage = () => {
  const [cells, setCells] = useState([]);
  const [form, setForm] = useState({
    block_name: "",
    capacity: "",
    actual_capacity: "",
    category: "",
    id: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCells();
  }, []);

  const fetchCells = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cells");
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
        capacity: parseInt(form.capacity),
        actual_capacity: parseInt(form.actual_capacity),
        category: form.category,
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/cells/${form.id}`, payload);
      } else {
        await axios.post("http://localhost:5000/api/cells", payload);
      }

      setForm({
        block_name: "",
        capacity: "",
        actual_capacity: "",
        category: "",
        id: null,
      });
      setIsEditing(false);
      fetchCells();
    } catch (err) {
      console.error("Error saving cell:", err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (cell) => {
    setForm({
      block_name: cell.block_name,
      capacity: cell.capacity,
      actual_capacity: cell.actual_capacity,
      category: cell.category,
      id: cell.cell_block_ID,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cell?")) {
      try {
        await axios.delete(`http://localhost:5000/api/cells/${id}`);
        fetchCells();
      } catch (err) {
        console.error("Error deleting cell:", err.response ? err.response.data : err.message);
      }
    }
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Cell" : "Create Cell"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="block_name"
          placeholder="Block Name"
          value={form.block_name}
          onChange={handleInputChange}
          maxLength={1}
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="actual_capacity"
          placeholder="Actual Capacity"
          value={form.actual_capacity}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isEditing ? "Update" : "Create"}</button>
      </form>

      <h2>Cells List</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Block Name</th>
            <th>Capacity</th>
            <th>Actual Capacity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cells.map((cell) => (
            <tr key={cell.cell_block_ID}>
              <td>{cell.cell_block_ID}</td>
              <td>{cell.block_name}</td>
              <td>{cell.capacity}</td>
              <td>{cell.actual_capacity}</td>
              <td>{cell.category}</td>
              <td>
                <button onClick={() => handleEdit(cell)}>Edit</button>
                <button onClick={() => handleDelete(cell.cell_block_ID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CellPage;
