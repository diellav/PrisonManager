import React, { useEffect, useState } from "react";
import axios from "axios";
import BlocksList from "./BlocksList";
import BlockForm from "./BlockForm";

const BlockPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState({ block_name: "", category: "", block_id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blocks");
      setBlocks(res.data);
    } catch (err) {
      console.error("Error fetching blocks:", err);
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
        await axios.put(`http://localhost:5000/api/blocks/${form.block_id}`, {
          block_name: form.block_name,
          category: form.category,
        });
      } else {
        await axios.post("http://localhost:5000/api/blocks", {
          block_name: form.block_name,
          category: form.category,
        });
      }
      setForm({ block_name: "", category: "", block_id: null });
      setIsEditing(false);
      setShowForm(false);
      fetchBlocks();
    } catch (err) {
      console.error("Error saving block:", err);
    }
  };

  const handleEdit = (block) => {
    setForm({ block_name: block.block_name, category: block.category, block_id: block.block_id });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this block?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blocks/${id}`);
        fetchBlocks();
      } catch (err) {
        console.error("Error deleting block:", err);
      }
    }
  };

  const handleGoToCreate = () => {
    setForm({ block_name: "", category: "", block_id: null });
    setIsEditing(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = () => setShowForm(false);

  return (
    <div className="container mt-4">
      <BlockForm
        showModal={showForm}
        handleClose={handleClose}
        form={form}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      <BlocksList
        blocks={blocks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleGoToCreate}
      />
    </div>
  );
};

export default BlockPage;
