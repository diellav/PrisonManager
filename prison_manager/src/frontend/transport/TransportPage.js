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
  const [prisoners, setPrisoners] = useState([]);
  const [guards, setGuards] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    prisonerID: "",
    departure_location: "",
    destination_location: "",
    transport_date: "",
    transport_reason: "",
    status_: "",
    guard_ID: "",
    vehicle_ID: "",
    transport_ID: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("transport.read")) {
      fetchTransports();
      fetchPrisoners();
      fetchGuards();
      fetchVehicles();
    } else {
      showAlert("You don't have permission to view transports.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchTransports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/transport");
      setTransports(res.data);
    } catch (err) {
      console.error("Error fetching transports:", err.response?.data || err.message);
      showAlert("Error fetching transports.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      showAlert("Error fetching prisoners.", "danger");
    }
  };

  const fetchGuards = async () => {
    try {
      const res = await axiosInstance.get("/guard_staff");
      setGuards(res.data);
    } catch (err) {
      showAlert("Error fetching guards.", "danger");
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axiosInstance.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      showAlert("Error fetching vehicles.", "danger");
    }
  };

  const resetForm = () => {
    setForm({
      prisonerID: "",
      departure_location: "",
      destination_location: "",
      transport_date: "",
      transport_reason: "",
      status_: "",
      guard_ID: "",
      vehicle_ID: "",
      transport_ID: null,
    });
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    resetForm();
    fetchTransports();
  };

  const handleFormCancel = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (transport) => {
    if (!hasPermission("transport.edit")) {
      return showAlert("You don't have permission to edit transports.", "danger");
    }

    setForm({
      prisonerID: transport.prisonerID,
      departure_location: transport.departure_location,
      destination_location: transport.destination_location,
      transport_date: transport.transport_date?.split("T")[0] || "",
      transport_reason: transport.transport_reason,
      status_: transport.status_,
      guard_ID: transport.guard_ID,
      vehicle_ID: transport.vehicle_ID,
      transport_ID: transport.transport_ID,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("transport.delete")) {
      return showAlert("You don't have permission to delete transports.", "danger");
    }

    try {
      await axiosInstance.delete(`/transport/${id}`);
      fetchTransports();
    } catch (err) {
      console.error("Error deleting transport:", err.response?.data || err.message);
      showAlert("Failed to delete transport.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("transport.create")) {
      return showAlert("You don't have permission to create transports.", "danger");
    }
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Transport Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <TransportForm
          editingTransport={isEditing ? form : null}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          prisoners={prisoners}
          guards={guards}
          vehicles={vehicles}
        />
      ) : hasPermission("transport.read") ? (
        <TransportList
          transports={transports}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
          prisoners={prisoners}
          guards={guards}
          vehicles={vehicles}
        />
      ) : (
        <p>You do not have permission to view transports.</p>
      )}
    </div>
  );
};

export default TransportPage;
