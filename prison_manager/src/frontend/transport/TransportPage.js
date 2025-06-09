
import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import TransportForm from "./TransportForm";
import TransportList from "./TransportList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const TransportPage = () => {
  const [transports, setTransports] = useState([]);
  const [form, setForm] = useState({
    transport_ID: null,
    prisonerID: "",
    departure_location: "",
    destination_location: "",
    transport_date: "",
    transport_reason: "",
    status_: "",
    guard_ID: "",
    vehicle_ID: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("transport.read")) fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      const res = await axiosInstance.get("/transport");
      setTransports(res.data);
    } catch (err) {
      console.error("Failed to fetch transports:", err.response?.data || err.message);
    }
  };

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && hasPermission("transport.edit")) {
        await axiosInstance.put(`/transport/${form.transport_ID}`, form);
      } else if (!isEditing && hasPermission("transport.create")) {
        await axiosInstance.post("/transport", form);
      } else {
        return showAlert("You don't have permission to perform this action.", "danger");
      }
      setShowForm(false);
      fetchTransports();
      resetForm();
    } catch (error) {
      showAlert("Failed to save transport record.", "danger");
      console.error("Failed to save transport:", error.response?.data || error.message);
    }
  };

  const handleEdit = async (transport) => {
    if (!hasPermission("transport.edit")) {
      alert("No permission to edit transport records.");
      return;
    }
    try {
      const res = await axiosInstance.get(`/transport/${transport.transport_ID}`);
      const data = res.data;
      const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      setForm({
        transport_ID: data.transport_ID,
        prisonerID: data.prisonerID || "",
        departure_location: data.departure_location || "",
        destination_location: data.destination_location || "",
        transport_date: formatDate(data.transport_date),
        transport_reason: data.transport_reason || "",
        status_: data.status_ || "",
        guard_ID: data.guard_ID || "",
        vehicle_ID: data.vehicle_ID || "",
      });
      setIsEditing(true);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Failed to fetch transport details.");
      console.error("Error fetching transport:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("transport.delete")) return showAlert("No permission to delete transport records.", "danger");
    if (window.confirm("Are you sure you want to delete this transport record?")) {
      try {
        await axiosInstance.delete(`/transport/${id}`);
        fetchTransports();
      } catch (err) {
        showAlert("Failed to delete transport record.", "danger");
        console.error("Error deleting transport:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    if (!hasPermission("transport.create")) return showAlert("No permission to create transport records.", "danger");
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      transport_ID: null,
      prisonerID: "",
      departure_location: "",
      destination_location: "",
      transport_date: "",
      transport_reason: "",
      status_: "",
      guard_ID: "",
      vehicle_ID: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Transport Management</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">{alert.message}</div>
      )}

      {showForm ? (
        <TransportForm
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          handleClose={() => setShowForm(false)}
        />
      ) : (
        <TransportList
          transports={transports}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleGoToCreate}
        />
      )}
    </div>
  );
};

export default TransportPage;
