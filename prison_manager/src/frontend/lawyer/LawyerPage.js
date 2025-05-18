import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import LawyerForm from "./LawyerForm";
import LawyersList from "./LawyerList";

const LawyerPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    category: "",
    id: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const res = await axiosInstance.get("/lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.error("Error fetching lawyers:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      email: form.email,
      category: form.category,
    };

    try {
      if (isEditing) {
        await axiosInstance.put(`/lawyers/${form.id}`, payload);
      } else {
        await axiosInstance.post("/lawyers", payload);
      }

      resetForm();
      fetchLawyers();
    } catch (err) {
      console.error("Error saving lawyer:", err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      category: "",
      id: null,
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (lawyer) => {
    setForm({
      first_name: lawyer.first_name,
      last_name: lawyer.last_name,
      phone: lawyer.phone,
      email: lawyer.email,
      category: lawyer.category,
      id: lawyer.lawyer_ID,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lawyer?")) {
      try {
        await axiosInstance.delete(`/lawyers/${id}`);
        fetchLawyers();
      } catch (err) {
        console.error("Error deleting lawyer:", err.response?.data || err.message);
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
      <LawyerForm
        showModal={showForm}
        handleClose={handleClose}
        form={form}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      <LawyersList
        lawyers={lawyers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleGoToCreate}
      />
    </div>
  );
};

export default LawyerPage;
