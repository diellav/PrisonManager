import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import CourtHearingForm from "./court_hearingForm";
import CourtHearingList from "./court_hearingList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const CourtHearingPage = () => {
  const [courtHearings, setCourtHearings] = useState([]);
  const [judges, setJudges] = useState([]);
  const [cases, setCases] = useState([]);
  const [editingHearing, setEditingHearing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const fetchCourtHearings = async () => {
    try {
      const res = await axiosInstance.get("/court_hearings");
      setCourtHearings(res.data);
    } catch (err) {
      console.error("Error fetching court hearings:", err);
      showAlert("Error fetching court hearings", "danger");
    }
  };

  const fetchJudges = async () => {
    try {
      const res = await axiosInstance.get("/judges");
      setJudges(res.data);
    } catch (err) {
      console.error("Error fetching judges:", err);
      showAlert("Error fetching judges", "danger");
    }
  };

  const fetchCases = async () => {
    try {
      const res = await axiosInstance.get("/cases");
      setCases(res.data);
    } catch (err) {
      console.error("Error fetching cases:", err);
      showAlert("Error fetching cases", "danger");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchCourtHearings(), fetchJudges(), fetchCases()]);
    setLoading(false);
  };

  useEffect(() => {
    if (hasPermission("court_hearings.read")) {
      fetchAllData();
    } else {
      showAlert("You don't have permission to view court hearings.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleCreate = () => {
    if (!hasPermission("court_hearings.create")) {
      return showAlert("You don't have permission to create court hearings.", "danger");
    }
    setEditingHearing(null);
    setShowForm(true);
  };

  const handleEdit = (hearing) => {
    if (!hasPermission("court_hearings.edit")) {
      return showAlert("You don't have permission to edit court hearings.", "danger");
    }
    setEditingHearing(hearing);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("court_hearings.delete")) {
      return showAlert("You don't have permission to delete court hearings.", "danger");
    }
    try {
      await axiosInstance.delete(`/court_hearings/${id}`);
      showAlert("Court hearing deleted successfully.", "success");
      fetchAllData();
    } catch (err) {
      console.error("Error deleting court hearing:", err);
      showAlert("Failed to delete court hearing.", "danger");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHearing(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingHearing(null);
    fetchAllData();
    showAlert("Court hearing saved successfully.", "success");
  };

  return (
    <div className="container mt-4">
      <h2>Court Hearings Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showForm ? (
        <CourtHearingForm
          editingHearing={editingHearing}
          judges={judges}
          cases={cases}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <CourtHearingList
          courtHearings={courtHearings}
          judges={judges}
          cases={cases}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default CourtHearingPage;
