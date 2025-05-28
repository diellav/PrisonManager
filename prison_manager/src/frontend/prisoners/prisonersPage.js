import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import PrisonerForm from "./PrisonersForm";
import PrisonersList from "./PrisonersList";

const PrisonersPage = () => {
  const [prisoners, setPrisoners] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    national_id: "",
    address_: "",
    photo: "",
    sentence_start: "",
    sentence_end: "",
    status_: "",
    rank_: "",
    cell_block_ID: "",
    emergency_contact_ID: "",
    prisonerID: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPrisoners();
  }, []);

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Error fetching prisoners:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      national_id: "",
      address_: "",
      photo: "",
      sentence_start: "",
      sentence_end: "",
      status_: "",
      rank_: "",
      cell_block_ID: "",
      emergency_contact_ID: "",
      prisonerID: null,
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form };

      if (isEditing) {
        await axiosInstance.put(`/prisoners/${form.prisonerID}`, payload);
      } else {
        await axiosInstance.post("/prisoners", payload);
      }

      resetForm();
      fetchPrisoners();
    } catch (err) {
      console.error("Error saving prisoner:", err.response?.data || err.message);
    }
  };

  const handleEdit = (prisoner) => {
    setForm({
      first_name: prisoner.first_name,
      last_name: prisoner.last_name,
      date_of_birth: prisoner.date_of_birth?.split("T")[0] || "",
      gender: prisoner.gender,
      national_id: prisoner.national_id,
      address_: prisoner.address_,
      photo: prisoner.photo,
      sentence_start: prisoner.sentence_start?.split("T")[0] || "",
      sentence_end: prisoner.sentence_end?.split("T")[0] || "",
      status_: prisoner.status_,
      rank_: prisoner.rank_,
      cell_block_ID: prisoner.cell_block_ID || "",
      emergency_contact_ID: prisoner.emergency_contact_ID,
      prisonerID: prisoner.prisonerID,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prisoner?")) {
      try {
        await axiosInstance.delete(`/prisoners/${id}`);
        fetchPrisoners();
      } catch (err) {
        console.error("Error deleting prisoner:", err.response?.data || err.message);
      }
    }
  };

  const handleModalOpen = () => {
    resetForm();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Prisoners Management</h2>
      {showModal ? (
        <PrisonerForm
          form={form}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleClose={handleModalClose}
        />
      ) : (
        <PrisonersList
          prisoners={prisoners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
        />
      )}
    </div>
  );
};

export default PrisonersPage;
