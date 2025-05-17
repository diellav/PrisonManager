import React, { useEffect, useState } from "react";
import axios from "axios";
import EmergencyContactForm from "./EmergencyContactForm";
import EmergencyContactsList from "./EmergencyContactsList";

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
    id: null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/emergency_contacts", axiosConfig);
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts:", err.response ? err.response.data : err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        phone: form.phone,
        address_: form.address_,
        email: form.email,
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/emergency_contacts/${form.id}`, payload, axiosConfig);
      } else {
        await axios.post("http://localhost:5000/api/emergency_contacts", payload, axiosConfig);
      }

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
      setShowForm(false);
      fetchContacts();
    } catch (err) {
      console.error("Error saving contact:", err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (contact) => {
    setForm({
      first_name: contact.first_name,
      last_name: contact.last_name,
      date_of_birth: contact.date_of_birth,
      gender: contact.gender,
      phone: contact.phone,
      address_: contact.address_,
      email: contact.email,
      id: contact.emergency_contact_ID,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`http://localhost:5000/api/emergency_contacts/${id}`, axiosConfig);
        fetchContacts();
      } catch (err) {
        console.error("Error deleting contact:", err.response ? err.response.data : err.message);
      }
    }
  };

  const handleGoToCreate = () => {
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
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = () => setShowForm(false);

  return (
    <div className="container mt-4">
      <EmergencyContactForm
        showModal={showForm}
        handleClose={handleClose}
        form={form}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      <EmergencyContactsList
        contacts={contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleGoToCreate}
      />
    </div>
  );
};

export default EmergencyContactPage;
