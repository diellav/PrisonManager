import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import GuardStaffForm from "./GuardStaffForm";
import GuardStaffList from "./GuardStaffList";

const GuardStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState());
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  function initialFormState() {
    return {
      userID: "",
      guard_position: "",
      guard_staff_ID: null,
    };
  }

  useEffect(() => {
    fetchStaff();
    fetchUsers();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/guard_staff");
      setStaff(res.data);
    } catch (err) {
      console.error("Error fetching guard staff:", err.response?.data || err.message);
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
        const id = Number(form.guard_staff_ID);
        if (isNaN(id)) throw new Error("Invalid guard_staff_ID for update.");
        await axiosInstance.put(`/guard_staff/${id}`, form);
      } else {
        await axiosInstance.post("/guard_staff", form);
      }
      resetForm();
      fetchStaff();
    } catch (err) {
      console.error("Error saving guard staff:", err.response?.data || err.message);
    }
  };

  const handleEdit = (staffMember) => {
    setForm({
      userID: staffMember.userID,
      guard_position: staffMember.guard_position,
      guard_staff_ID: Number(staffMember.guard_staff_ID),
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
      <h2 className="mb-4">Guard Staff Management</h2>
      {showModal ? (
        <GuardStaffForm
          form={form}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleClose={handleModalClose}
        />
      ) : (
        <GuardStaffList
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

export default GuardStaffPage;
