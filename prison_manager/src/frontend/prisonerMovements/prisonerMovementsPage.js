import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import PrisonerMovementsForm from "./PrisonerMovementForm";
import PrisonerMovementList from "./PrisonerMovementList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const PrisonerMovementsPage = () => {
  const [movements, setMovements] = useState([]);
  const [editingMovement, setEditingMovement] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [form, setForm] = useState({
    prisonerID: "",
    from_cell_ID: "",
    to_cell_ID: "",
    date_: "",
  });

  useEffect(() => {
    if (hasPermission("prisoner_movements.read")) {
      fetchMovements();
    } else {
      setLoading(false);
      setError("You do not have permission to view prisoner movements.");
    }
  }, []);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/prisoner_movements");
      setMovements(res.data);
    } catch (err) {
      console.error("Error fetching movements:", err);
      setError("Error fetching prisoner movements.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      prisonerID: "",
      from_cell_ID: "",
      to_cell_ID: "",
      date_: "",
    });
    setEditingMovement(null);
    setShowForm(false);
  };

  const goToCreate = () => {
    if (!hasPermission("prisoner_movements.create")) return;

    resetForm();
    setShowForm(true);
  };

  const onEdit = (movement) => {
    if (!hasPermission("prisoner_movements.edit")) return;

    setForm({
      prisonerID: movement.prisonerID || "",
      from_cell_ID: movement.from_cell_ID || "",
      to_cell_ID: movement.to_cell_ID || "",
      date_: movement.date_ ? movement.date_.slice(0, 10) : "",
    });
    setEditingMovement(movement);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!hasPermission("prisoner_movements.delete")) return;

    try {
      await axiosInstance.delete(`/prisoner_movements/${id}`);
      setMovements((prevMovements) =>
        prevMovements.filter((movement) => movement.prisoner_movement_ID !== id)
      );
    } catch (err) {
      console.error("Error deleting movement:", err);
      setError("Failed to delete movement.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        prisonerID: Number(form.prisonerID),
        from_cell_ID: Number(form.from_cell_ID),
        to_cell_ID: Number(form.to_cell_ID),
        date_: form.date_,
      };
  
      if (editingMovement) {
        await axiosInstance.put(`/prisoner_movements/${editingMovement.prisoner_movement_ID}`, payload);
      } else {
        await axiosInstance.post("/prisoner_movements", payload);
      }
  
      await axiosInstance.put(`/prisoners/${form.prisonerID}`, {
        cell_block_ID: Number(form.to_cell_ID),
      });
  
      resetForm();
      fetchMovements();
    } catch (err) {
      console.error("Error saving movement or updating prisoner:", err.response?.data || err.message);
      alert("An error occurred while saving movement.");
    }
  };
  

  const onCancel = () => {
    resetForm();
  };

  return (
    <div className="container mt-4">
      <h2>Prisoner Movements Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm && (hasPermission("prisoner_movements.create") || hasPermission("prisoner_movements.edit")) ? (
        <PrisonerMovementsForm
          form={form}
          isEditing={!!editingMovement}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleClose={onCancel}
        />
      ) : (
        hasPermission("prisoner_movements.read") && (
          <PrisonerMovementList
            movements={movements}
            onEdit={onEdit}
            onDelete={onDelete}
            goToCreate={goToCreate}
          />
        )
      )}
    </div>
  );
};

export default PrisonerMovementsPage;
