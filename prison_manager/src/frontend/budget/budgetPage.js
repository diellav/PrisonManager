import React, { useEffect, useState } from "react";
import axios from "axios";
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
      const res = await axios.get("http://localhost:5000/api/budgets");
      setBudgets(res.data);
      setError(null);
    } catch (err) {
      setError("Error fetching budgets.");
    } finally {
      setLoading(false);
    }
  };

  const goToCreate = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const onEdit = (budget) => {
    setEditingBudget({
      id: budget.budget_ID,
      year: budget.year_,
      allocated_funds: budget.allocated_funds,
      used_funds: budget.used_funds,
      remaining_funds: budget.remaining_funds,
      last_updated: budget.last_updated ? budget.last_updated.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axios.delete(`http://localhost:5000/api/budgets/${id}`);
        setBudgets(budgets.filter((b) => b.budget_ID !== id));
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
