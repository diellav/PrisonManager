import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import MedicalStaffForm from "./medicalStaffForm";
import MedicalStaffList from "./medicalStaffList";

const MedicalStaffPage = () => {
  const [medicalStaff, setMedicalStaff] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicalStaff();
  }, []);

  const fetchMedicalStaff = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/medical_staff");
      setMedicalStaff(res.data);
    } catch (err) {
      console.error("Error fetching medical staff:", err);
      setError("Error fetching medical staff.");
    } finally {
      setLoading(false);
    }
  };

  const goToCreate = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  const onEdit = (staff) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medical staff?")) {
      try {
        await axiosInstance.delete(`/medical_staff/${id}`);
        setMedicalStaff(medicalStaff.filter((m) => m.medical_staff_ID !== id));
      } catch (err) {
        console.error("Error deleting medical staff:", err);
        setError("Failed to delete medical staff.");
      }
    }
  };

  const onSuccess = () => {
    setShowForm(false);
    fetchMedicalStaff();
  };

  const onCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <h2>Medical Staff Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm ? (
        <MedicalStaffForm
          editingStaff={editingStaff}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        <MedicalStaffList
          staffList={medicalStaff}
          onEdit={onEdit}
          onDelete={onDelete}
          goToCreate={goToCreate}
        />
      )}
    </div>
  );
};

export default MedicalStaffPage;
