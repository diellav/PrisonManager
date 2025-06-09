// VehiclesPage.js
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
  const [form, setForm] = useState({
    vehicle_ID: null,
    plate_number: "",
    type_: "",
    capacity: "",
    status_: "",
    transport_staff_ID: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("vehicles.read")) fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axiosInstance.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err.response?.data || err.message);
    }
  };

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && hasPermission("vehicles.edit")) {
        await axiosInstance.put(`/vehicles/${form.vehicle_ID}`, form);
      } else if (!isEditing && hasPermission("vehicles.create")) {
        await axiosInstance.post("/vehicles", form);
      } else {
        return showAlert("You don't have permission to perform this action.", "danger");
      }
      setShowForm(false);
      fetchVehicles();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        showAlert("Access denied: You do not have permission.", "danger");
      } else if (
        error.response?.status === 500 &&
        error.response.data?.includes("duplicate key")
      ) {
        showAlert("Plate number already exists.", "danger");
      } else {
        showAlert("Failed to save vehicle. Please try again.", "danger");
      }
      console.error("Failed to save vehicle:", error.response?.data || error.message);
    }
  };

  const handleEdit = async (vehicle) => {
    if (!hasPermission("vehicles.edit")) {
      alert("No permission to edit vehicles.");
      return;
    }
    try {
      const res = await axiosInstance.get(`/vehicles/${vehicle.vehicle_ID}`);
      const data = res.data;
      setForm({
        vehicle_ID: data.vehicle_ID,
        plate_number: data.plate_number || "",
        type_: data.type_ || "",
        capacity: data.capacity || "",
        status_: data.status_ || "",
        transport_staff_ID: data.transport_staff_ID || "",
      });
      setIsEditing(true);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert("Failed to fetch vehicle details.");
      console.error("Error fetching vehicle:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("vehicles.delete")) return showAlert("No permission to delete vehicles.", "danger");
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await axiosInstance.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (err) {
        showAlert("Failed to delete vehicle.", "danger");
        console.error("Error deleting vehicle:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    if (!hasPermission("vehicles.create")) return showAlert("No permission to create vehicles.", "danger");
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      vehicle_ID: null,
      plate_number: "",
      type_: "",
      capacity: "",
      status_: "",
      transport_staff_ID: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Vehicles Management</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      {showForm && (
        <VehiclesForm
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          handleClose={() => setShowForm(false)}
        />
      )}
      {!showForm && (
        <VehiclesList
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleGoToCreate}
        />
      )}
    </div>
  );
};

export default VehiclesPage;
