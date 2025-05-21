import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    year: "",
    allocated_funds: "",
    used_funds: "",
    remaining_funds: "",
    last_updated: "",
    id: null,
  });

  const [isEditing, setIsEditing] = useState(false);
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const remaining = parseFloat(form.allocated_funds || 0) - parseFloat(form.used_funds || 0);

      const bdg = {
        year: parseInt(form.year),
        allocated_funds: parseFloat(form.allocated_funds),
        used_funds: parseFloat(form.used_funds),
        remaining_funds: remaining,
        last_updated: form.last_updated,
      };

      if (isEditing) {
        await axiosInstance.put(`/budgets/${form.id}`, bdg);
      } else {
        await axiosInstance.post("/budgets", bdg);
      }

      resetForm();
      fetchBudgets();
    } catch (err) {
      console.error("Error saving budget:", err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setForm({
      year: "",
      allocated_funds: "",
      used_funds: "",
      remaining_funds: "",
      last_updated: "",
      id: null,
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const handleEdit = (budget) => {
    setForm({
      year: budget.year_,
      allocated_funds: budget.allocated_funds,
      used_funds: budget.used_funds,
      remaining_funds: budget.remaining_funds,
      last_updated: formatDateForInput(budget.last_updated),
      id: budget.budget_ID,
    });
    setIsEditing(true);
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
    fetchBudgets();
  };

  const onCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h2>Budget Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm ? (
        <BudgetForm editingBudget={editingBudget} onSuccess={onSuccess} onCancel={onCancel} />
      ) : (
        <BudgetList budgets={budgets} onEdit={onEdit} onDelete={onDelete} goToCreate={goToCreate} />
      )}
    </div>
  );
};

export default BudgetPage;
