import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("budget.read")) {
      fetchBudgets();
    } else {
      showAlert("You don't have permission to view budgets.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/budgets");
      setBudgets(res.data);
      setAlert({ message: "", type: "" });
    } catch (err) {
      console.error("Error fetching budgets:", err.response?.data || err.message);
      showAlert("Failed to fetch budgets.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget) => {
    if (!hasPermission("budget.edit")) {
      return showAlert("You don't have permission to edit budgets.", "danger");
    }
    setForm(budget);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("budget.delete")) {
      return showAlert("You don't have permission to delete budgets.", "danger");
    }
    try {
      await axiosInstance.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error("Error deleting budget:", err.response?.data || err.message);
      showAlert("Failed to delete budget.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("budget.create")) {
      return showAlert("You don't have permission to create budgets.", "danger");
    }
    setForm(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setForm(null);
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2>Budget Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <BudgetForm
          editingBudget={isEditing ? form : null}
          onSuccess={() => {
            setShowModal(false);
            fetchBudgets();
            setIsEditing(false);
            setForm(null);
          }}
          onCancel={handleModalClose}
        />
      ) : hasPermission("budget.read") ? (
        <BudgetList
          budgets={budgets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
        />
      ) : (
        <p>You do not have permission to view budgets.</p>
      )}
    </div>
  );
};

export default BudgetPage;
