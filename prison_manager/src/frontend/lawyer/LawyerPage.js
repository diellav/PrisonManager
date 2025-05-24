import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import LawyerForm from "./LawyerForm";
import LawyersList from "./LawyerList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const LawyerPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [editingLawyer, setEditingLawyer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasPermission("lawyers.read")) {
      fetchLawyers();
    } else {
      setLoading(false);
      setError("You do not have permission to view lawyers.");
    }
  }, []);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.error("Error fetching lawyers:", err);
      setError("Error fetching lawyers.");
    } finally {
      setLoading(false);
    }
  };

  const goToCreate = () => {
    if (!hasPermission("lawyers.create")) return;
    setEditingLawyer(null);
    setShowForm(true);
  };

  const onEdit = (lawyer) => {
    if (!hasPermission("lawyers.edit")) return;
    setEditingLawyer(lawyer);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!hasPermission("lawyers.delete")) return;

    try {
      await axiosInstance.delete(`/lawyers/${id}`);
      setLawyers(lawyers.filter((l) => l.lawyer_ID !== id));
    } catch (err) {
      console.error("Error deleting lawyer:", err);
      setError("Failed to delete lawyer.");
    }
  };

  const onSuccess = () => {
    setShowForm(false);
    fetchLawyers();
  };

  const onCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h2>Lawyers Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm && (hasPermission("lawyers.create") || hasPermission("lawyers.edit")) ? (
        <LawyerForm
          editingLawyer={editingLawyer}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        hasPermission("lawyers.read") && (
          <LawyersList
            lawyers={lawyers}
            onEdit={onEdit}
            onDelete={onDelete}
            goToCreate={goToCreate}
          />
        )
      )}
    </div>
  );
};

export default LawyerPage;
