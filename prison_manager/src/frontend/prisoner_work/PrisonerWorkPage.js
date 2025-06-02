import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import PrisonerWorkForm from "./PrisonerWorkForm";
import PrisonerWorkList from "./PrisonerWorkList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const PrisonerWorkPage = () => {
  const [works, setWorks] = useState([]);
  const [editingWork, setEditingWork] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prisoners, setPrisoners] = useState([]);

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Failed to fetch prisoners", err);
    }
  };

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/prisoner_work");
      setWorks(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch prisoner work records.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrisoners();
    fetchWorks();
  }, []);

  const handleDelete = async (id) => {
    if (!hasPermission("prisoner_work.delete")) {
      alert("You don't have permission to delete.");
      return;
    }
    try {
      await axiosInstance.delete(`/prisoner_work/${id}`);
      fetchWorks();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleEdit = (work) => {
    if (!hasPermission("prisoner_work.edit")) {
      alert("You don't have permission to edit.");
      return;
    }
    setEditingWork(work);
    setShowForm(true);
  };

  const handleCreate = () => {
    if (!hasPermission("prisoner_work.create")) {
      alert("You don't have permission to create.");
      return;
    }
    setEditingWork(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingWork(null);
    fetchWorks();
  };

  return (
    <div className="container-fluid">
        <h2>Prisoner Work Management</h2>
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !showForm && (
        <PrisonerWorkList
          works={works}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleCreate}
          prisoners={prisoners}
        />
      )}

      {showForm && (
        <PrisonerWorkForm
          editingWork={editingWork}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
          prisoners={prisoners}
        />
      )}
    </div>
  );
};

export default PrisonerWorkPage;
