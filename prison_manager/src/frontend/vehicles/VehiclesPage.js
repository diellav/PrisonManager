import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import VehiclesForm from "./VehiclesForm";
import VehiclesList from "./VehiclesList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [transportStaff, setTransportStaff] = useState([]);
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("vehicles.read")) {
      fetchVehicles();
      fetchTransportStaff();
    } else {
      showAlert("You don't have permission to view vehicles.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err.response?.data || err.message);
      showAlert("Error fetching vehicles.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransportStaff = async () => {
    try {
      const res = await axiosInstance.get("/transport_staff");
      setTransportStaff(res.data);
    } catch (err) {
      console.error("Error fetching transport staff:", err.response?.data || err.message);
      showAlert("Error fetching transport staff.", "danger");
    }
  };

  const resetForm = () => {
    setForm(null);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    resetForm();
    fetchVehicles();
  };

  const handleFormCancel = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (vehicle) => {
    if (!hasPermission("vehicles.edit")) {
      return showAlert("You don't have permission to edit vehicles.", "danger");
    }

    setForm(vehicle);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("vehicles.delete")) {
      return showAlert("You don't have permission to delete vehicles.", "danger");
    }

    try {
      await axiosInstance.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error("Error deleting vehicle:", err.response?.data || err.message);
      showAlert("Failed to delete vehicle.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("vehicles.create")) {
      return showAlert("You don't have permission to create vehicles.", "danger");
    }
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Vehicles Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <VehiclesForm
          editingVehicle={isEditing ? form : null}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          transportStaff={transportStaff}
        />
      ) : hasPermission("vehicles.read") ? (
        <VehiclesList
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
          transportStaff={transportStaff}
        />
      ) : (
        <p>You do not have permission to view vehicles.</p>
      )}
    </div>
  );
};

export default VehiclesPage;