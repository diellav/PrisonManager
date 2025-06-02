import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import CaseForm from "./caseForm";
import CaseList from "./caseList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const CasePage = () => {
  const [cases, setCases] = useState([]);
  const [prisoners, setPrisoners] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [editingCase, setEditingCase] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      const res = await axiosInstance.get("/cases");
      setCases(res.data);
    } catch (err) {
      console.error("Error fetching cases:", err);
      showAlert("Error fetching cases", "danger");
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

  const fetchLawyers = async () => {
    try {
      const res = await axiosInstance.get("/lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.error("Error fetching lawyers:", err);
      showAlert("Error fetching lawyers", "danger");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchCases(), fetchPrisoners(), fetchLawyers()]);
    setLoading(false);
  };

  useEffect(() => {
    if (hasPermission("cases.read")) {
      fetchAllData();
    } else {
      showAlert("You don't have permission to view cases.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleCreate = () => {
    if (!hasPermission("cases.create")) {
      return showAlert("You don't have permission to create cases.", "danger");
    }
    setEditingCase(null);
    setShowForm(true);
  };

  const handleEdit = (caseItem) => {
    if (!hasPermission("cases.edit")) {
      return showAlert("You don't have permission to edit cases.", "danger");
    }
    setEditingCase(caseItem);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("cases.delete")) {
      return showAlert("You don't have permission to delete cases.", "danger");
    }
    try {
      await axiosInstance.delete(`/cases/${id}`);
      showAlert("Case deleted successfully.", "success");
      fetchAllData();
    } catch (err) {
      console.error("Error deleting case:", err);
      showAlert("Failed to delete case.", "danger");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingCase(null);
    fetchAllData();
    showAlert("Case saved successfully.", "success");
  };

  return (
    <div className="container mt-4">
      <h2>Case Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showForm ? (
        <CaseForm
          editingCase={editingCase}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <CaseList
          cases={cases}
          prisoners={prisoners} 
          lawyers={lawyers}     
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default CasePage;
