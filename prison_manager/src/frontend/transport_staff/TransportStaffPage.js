import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import TransportStaffForm from "./TransportStaffForm";
import TransportStaffList from "./TransportStaffList";

const TransportStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState());
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function initialFormState() {
    return {
      userID: "",
      transport_role: "",
      transport_staff_ID: null,
    };
  }

  useEffect(() => {
    fetchStaff();
    fetchUsers();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/transport_staff");
      setStaff(res.data);
    } catch (err) {
      console.error("Error fetching transport staff:", err.response?.data || err.message);
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
        const id = Number(form.transport_staff_ID);
        if (isNaN(id)) throw new Error("Invalid transport_staff_ID for update.");
        await axiosInstance.put(`/transport_staff/${id}`, form);
      } else {
        await axiosInstance.post("/transport_staff", form);
      }
      resetForm();
      fetchStaff();
    } catch (err) {
      console.error("Error saving transport staff:", err.response?.data || err.message);
    }
  };

  const handleEdit = (staffMember) => {
    setForm({
      userID: staffMember.userID,
      transport_role: staffMember.transport_role,
      transport_staff_ID: Number(staffMember.transport_staff_ID),
    });
    setIsEditing(true);
    setShowModal(true);
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
      <h2 className="mb-4">Transport Staff Management</h2>
      {showModal ? (
        <TransportStaffForm
          form={form}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleClose={handleModalClose}
        />
      ) : (
        <TransportStaffList
          staff={staff}
          users={users}
          onEdit={handleEdit}
          goToCreate={handleModalOpen}
          showConfirm={showConfirm} 
        />
      )}
    </div>
  );
};

export default TransportStaffPage;
