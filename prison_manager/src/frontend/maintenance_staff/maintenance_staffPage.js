import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import MaintenanceStaffForm from "./maintenance_staffForm";
import MaintenanceStaffList from "./maintenance_staffList";

const MaintenanceStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState());
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function initialFormState() {
    return {
      userID: "",
      maintenance_role: "",
      maintenance_staff_ID: null,
    };
  }

  useEffect(() => {
    fetchStaff();
    fetchUsers();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/maintenance_staff");
      setStaff(res.data);
    } catch (err) {
      console.error("Error fetching maintenance staff:", err.response?.data || err.message);
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
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const id = Number(form.maintenance_staff_ID);
        if (isNaN(id)) throw new Error("Invalid maintenance_staff_ID for update.");
        await axiosInstance.put(`/maintenance_staff/${id}`, form);
      } else {
        await axiosInstance.post("/maintenance_staff", form);
      }
      resetForm();
      fetchStaff();
    } catch (err) {
      console.error("Error saving maintenance staff:", err.response?.data || err.message);
    }
  };

  const handleEdit = (staffMember) => {
    setForm({
      userID: staffMember.userID,
      maintenance_role: staffMember.maintenance_role,
      maintenance_staff_ID: Number(staffMember.maintenance_staff_ID),
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/maintenance_staff/${id}`);
      fetchStaff();
    } catch (err) {
      console.error("Error deleting maintenance staff:", err.response?.data || err.message);
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
      <h2 className="mb-4">Maintenance Staff Management</h2>
      {showModal ? (
        <MaintenanceStaffForm
          form={form}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleClose={handleModalClose}
        />
      ) : (
        <MaintenanceStaffList
          staff={staff}
          users={users}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          goToCreate={handleModalOpen}
          showConfirm={showConfirm}
          deleteId={deleteId}
          onConfirmDelete={() => {
            handleDelete(deleteId);
            setShowConfirm(false);
          }}
          onCancelDelete={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default MaintenanceStaffPage;
