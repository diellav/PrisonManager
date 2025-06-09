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
  const [editingTransport, setEditingTransport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/transport");
      setTransports(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch transports", err);
      setError("Failed to fetch transports.");
    }
    setLoading(false);
  };

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Failed to fetch prisoners", err);
    }
  };

  const fetchGuards = async () => {
    try {
      const res = await axiosInstance.get("/guard_staff");
      setGuards(res.data);
    } catch (err) {
      console.error("Failed to fetch guards", err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axiosInstance.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
    }
  };

  useEffect(() => {
    fetchPrisoners();
    fetchGuards();
    fetchVehicles();
    fetchTransports();
  }, []);

  const handleDelete = async (id) => {
    if (!hasPermission("transport.delete")) {
      alert("You don't have permission to delete.");
      return;
    }
    try {
      await axiosInstance.delete(`/transport/${id}`);
      fetchTransports();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleEdit = (transport) => {
    if (!hasPermission("transport.edit")) {
      alert("You don't have permission to edit.");
      return;
    }
    setEditingTransport(transport);
    setShowForm(true);
  };

  const handleCreate = () => {
    if (!hasPermission("transport.create")) {
      alert("You don't have permission to create.");
      return;
    }
    setEditingTransport(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransport(null);
    fetchTransports();
  };

  return (
    <div className="container mt-4">
      <h2>Transport Management</h2>

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!loading && !showForm && (
        <TransportList
          transports={transports}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleCreate}
          prisoners={prisoners}
          guards={guards}
          vehicles={vehicles}
        />
      )}

      {showForm && (
        <TransportForm
          editingTransport={editingTransport}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
          prisoners={prisoners}
          guards={guards}
          vehicles={vehicles}
        />
      )}
    </div>
  );
};

export default TransportPage;