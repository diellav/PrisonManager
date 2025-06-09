import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import MedicalStaffForm from "./medicalStaffForm";
import MedicalStaffList from "./medicalStaffList";

const MedicalStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState());
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function initialFormState() {
    return {
      userID: "",
      specialty: "",
      medical_staff_ID: null,
    };
  }

  useEffect(() => {
    fetchStaff();
    fetchUsers();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/medical_staff");
      setStaff(res.data);
    } catch (err) {
      console.error("Error fetching medical staff:", err.response?.data || err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState());
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const id = Number(form.medical_staff_ID);
        if (isNaN(id)) throw new Error("Invalid medical_staff_ID for update.");
        await axiosInstance.put(`/medical_staff/${id}`, form);
      } else {
        await axiosInstance.post("/medical_staff", form);
      }
      resetForm();
      fetchStaff();
    } catch (err) {
      console.error("Error saving medical staff:", err.response?.data || err.message);
    }
  };

  const handleEdit = (staffMember) => {
    setForm({
      userID: staffMember.userID,
      specialty: staffMember.specialty,
      medical_staff_ID: Number(staffMember.medical_staff_ID),
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleFormOpen = () => {
    resetForm();
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Medical Staff Management</h2>
      {showForm ? (
        <MedicalStaffForm
          form={form}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleClose={handleFormClose}
        />
      ) : (
        <MedicalStaffList
          staff={staff}
          users={users}
          onEdit={handleEdit}
          goToCreate={handleFormOpen}
        />
      )}
    </div>
  );
};

export default MedicalStaffPage;
