import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/budgets");
      setBudgets(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching budgets:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const goToCreate = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axiosInstance.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        setError("Failed to delete budget.");
      }
    }
  };

  const onSuccess = () => {
    setShowForm(false);
    setEditingBudget(null);
    fetchBudgets();
  };

  const onCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  return (
    <div className="container mt-4">
      <h2>Budget Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm ? (
        <BudgetForm
          editingBudget={editingBudget}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        <BudgetList
          budgets={budgets}
          onEdit={onEdit}
          onDelete={onDelete}
          goToCreate={goToCreate}
        />
      )}
    </div>
  );
};

export default BudgetPage;
