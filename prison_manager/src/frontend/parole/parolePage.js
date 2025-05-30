import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import ParoleForm from "./paroleForm";
import ParoleList from "./paroleList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const ParolePage = () => {
  const [paroles, setParoles] = useState([]);
  const [editingParole, setEditingParole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const fetchParoles = async () => {
    try {
      const res = await axiosInstance.get("/paroles");
      setParoles(res.data);
    } catch (err) {
      console.error("Error fetching paroles:", err);
      showAlert("Error fetching paroles", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission("paroles.read")) {
      fetchParoles();
    } else {
      showAlert("You don't have permission to view paroles.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleCreate = () => {
    if (!hasPermission("paroles.create")) {
      return showAlert("You don't have permission to create paroles.", "danger");
    }
    setEditingParole(null);
    setShowForm(true);
  };

  const handleEdit = (parole) => {
    if (!hasPermission("paroles.edit")) {
      return showAlert("You don't have permission to edit paroles.", "danger");
    }
    setEditingParole(parole);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("paroles.delete")) {
      return showAlert("You don't have permission to delete paroles.", "danger");
    }
    try {
      await axiosInstance.delete(`/paroles/${id}`);
      showAlert("Parole deleted successfully.", "success");
      fetchParoles();
    } catch (err) {
      console.error("Error deleting parole:", err);
      showAlert("Failed to delete parole.", "danger");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingParole(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingParole(null);
    fetchParoles();
    showAlert("Parole saved successfully.", "success");
  };

  return (
    <div className="container mt-4">
      <h2>Parole Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showForm ? (
        <ParoleForm
          editingParole={editingParole}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <ParoleList
            paroles={paroles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            goToCreate={handleCreate}
          />
        </>
      )}
    </div>
  );
};

export default ParolePage;
