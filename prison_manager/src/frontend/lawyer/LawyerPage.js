import React, { useEffect, useState } from "react";
import axios from "axios";
import LawyerForm from "./LawyerForm";
import LawyersList from "./LawyerList";

const LawyerPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [editingLawyer, setEditingLawyer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.error("Error fetching lawyers:", err);
      setError("Error fetching lawyers.");
    } finally {
      setLoading(false);
    }
  };

  const goToCreate = () => {
    setEditingLawyer(null);
    setShowForm(true);
  };

  const onEdit = (lawyer) => {
    setEditingLawyer(lawyer);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lawyer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/lawyers/${id}`);
        setLawyers(lawyers.filter((l) => l.lawyer_ID !== id));
      } catch (err) {
        console.error("Error deleting lawyer:", err);
        setError("Failed to delete lawyer.");
      }
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
    <div>
      <h2>Lawyers Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm ? (
        <LawyerForm editingLawyer={editingLawyer} onSuccess={onSuccess} onCancel={onCancel} />
      ) : (
        <LawyersList
          lawyers={lawyers}
          onEdit={onEdit}
          onDelete={onDelete}
          goToCreate={goToCreate}
        />
      )}
    </div>
  );
};

export default LawyerPage;