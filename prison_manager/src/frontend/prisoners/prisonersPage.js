import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import PrisonerForm from "./PrisonersForm";
import PrisonersList from "./PrisonersList";

const PrisonersPage = () => {
  const [prisoners, setPrisoners] = useState([]);
  const [form, setForm] = useState(initialFormState());
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function initialFormState() {
    return {
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
    };
  }

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState());
    setFile(null);
    setIsEditing(false);
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      for (const key in form) {
        if (key !== "prisonerID" && form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      }

      if (form.cell_block_ID) {
        formData.set("cell_block_ID", Number(form.cell_block_ID));
      }
      if (form.emergency_contact_ID) {
        formData.set("emergency_contact_ID", Number(form.emergency_contact_ID));
      }

      if (file) {
        formData.append("photo", file);
      }

      if (isEditing) {
        const id = Number(form.prisonerID);
        if (isNaN(id)) throw new Error("Invalid prisonerID for update.");

        await axiosInstance.put(`/prisoners/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/prisoners", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
      prisonerID: Number(prisoner.prisonerID),
    });
    setFile(null); 
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
          setFile={setFile}  
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
