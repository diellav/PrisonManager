import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import PrisonerCallForm from "./prisoner_callForm";
import PrisonerCallList from "./prisoner_callList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const PrisonerCallPage = () => {
  const [calls, setCalls] = useState([]);
  const [prisoners, setPrisoners] = useState([]);
  const [editingCall, setEditingCall] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const fetchCalls = async () => {
    try {
      const res = await axiosInstance.get("/prisoner_calls");
      setCalls(res.data);
    } catch (err) {
      console.error("Error fetching calls:", err);
      showAlert("Error fetching calls", "danger");
    }
  };

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Error fetching prisoners:", err);
      showAlert("Error fetching prisoners", "danger");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchCalls(), fetchPrisoners()]);
    setLoading(false);
  };

  useEffect(() => {
    if (hasPermission("prisoner_calls.read")) {
      fetchAllData();
    } else {
      showAlert("You don't have permission to view prisoner calls.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleCreate = () => {
    if (!hasPermission("prisoner_calls.create")) {
      return showAlert("You don't have permission to create prisoner calls.", "danger");
    }
    setEditingCall(null);
    setShowForm(true);
  };

  const handleEdit = (call) => {
    if (!hasPermission("prisoner_calls.edit")) {
      return showAlert("You don't have permission to edit prisoner calls.", "danger");
    }
    setEditingCall(call);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("prisoner_calls.delete")) {
      return showAlert("You don't have permission to delete prisoner calls.", "danger");
    }
    try {
      await axiosInstance.delete(`/prisoner_calls/${id}`);
      showAlert("Call deleted successfully.", "success");
      fetchAllData();
    } catch (err) {
      console.error("Error deleting call:", err);
      showAlert("Failed to delete call.", "danger");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCall(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingCall(null);
    fetchAllData();
    showAlert("Call saved successfully.", "success");
  };

  return (
    <div className="container mt-4">
      <h2>Prisoner Call Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showForm ? (
        <PrisonerCallForm
          editingCall={editingCall}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <PrisonerCallList
          calls={calls}
          prisoners={prisoners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default PrisonerCallPage;
