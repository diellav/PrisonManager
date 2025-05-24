import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import EmergencyContactForm from "./EmergencyContactForm";
import EmergencyContactsList from "./EmergencyContactsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const EmergencyContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address_: "",
    email: "",
    id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("emergency_contact.read")) {
      fetchContacts();
    } else {
      showAlert("You don't have permission to view emergency contacts.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/emergency_contacts");
      setContacts(res.data);
      setAlert({ message: "", type: "" });
    } catch (err) {
      console.error("Error fetching contacts:", err.response?.data || err.message);
      showAlert("Error fetching emergency contacts.", "danger");
    } finally {
      setLoading(false);
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
      phone: "",
      address_: "",
      email: "",
      id: null,
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (
      (!isEditing && !hasPermission("emergency_contact.create")) ||
      (isEditing && !hasPermission("emergency_contact.edit"))
    ) {
      return showAlert(
        `You don't have permission to ${isEditing ? "edit" : "create"} emergency contacts.`,
        "danger"
      );
    }

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      phone: form.phone,
      address_: form.address_,
      email: form.email,
    };

    try {
      if (isEditing) {
        await axiosInstance.put(`/emergency_contacts/${form.id}`, payload);
        showAlert("Emergency contact updated successfully.", "success");
      } else {
        await axiosInstance.post("/emergency_contacts", payload);
        showAlert("Emergency contact created successfully.", "success");
      }
      resetForm();
      fetchContacts();
    } catch (err) {
      console.error("Error saving contact:", err.response?.data || err.message);
      showAlert("Failed to save emergency contact.", "danger");
    }
  };

  const handleEdit = (contact) => {
    if (!hasPermission("emergency_contact.edit")) {
      return showAlert("You don't have permission to edit emergency contacts.", "danger");
    }

    setForm({
      first_name: contact.first_name,
      last_name: contact.last_name,
      date_of_birth: contact.date_of_birth?.split("T")[0] || "",
      gender: contact.gender,
      phone: contact.phone,
      address_: contact.address_,
      email: contact.email,
      id: contact.emergency_contact_ID,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("emergency_contact.delete")) {
      return showAlert("You don't have permission to delete emergency contacts.", "danger");
    }

    try {
      await axiosInstance.delete(`/emergency_contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact:", err.response?.data || err.message);
      showAlert("Failed to delete emergency contact.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("emergency_contact.create")) {
      return showAlert("You don't have permission to create emergency contacts.", "danger");
    }
    resetForm();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2>Emergency Contact Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <EmergencyContactForm
          form={form}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleClose={handleModalClose}
        />
      ) : hasPermission("emergency_contact.read") ? (
        <EmergencyContactsList
          contacts={contacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
        />
      ) : (
        <p>You do not have permission to view emergency contacts.</p>
      )}
    </div>
  );
};

export default EmergencyContactPage;
