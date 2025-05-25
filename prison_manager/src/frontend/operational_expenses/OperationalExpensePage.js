import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import OperationalExpenseForm from "./OperationalExpenseForm";
import OperationalExpensesList from "./OperationalExpenseList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const OperationalExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);

const fetchBudgets = async () => {
  try {
    const res = await axiosInstance.get("/budgets");
    setBudgets(res.data);
  } catch (err) {
    console.error("Failed to fetch budgets", err);
  }
};

const fetchAssets = async () => {
  try {
    const res = await axiosInstance.get("/assets");
    setAssets(res.data);
  } catch (err) {
    console.error("Failed to fetch assets", err);
  }
};

const fetchUsers = async () => {
  try {
    const res = await axiosInstance.get("/users");
    setUsers(res.data);
  } catch (err) {
    console.error("Failed to fetch users", err);
  }
};

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/operational_expenses");
      setExpenses(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch operational expenses.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  fetchAssets();
  fetchUsers();
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!hasPermission("operational_expenses.delete")) {
      alert("You don't have permission to delete.");
      return;
    }
    try {
      await axiosInstance.delete(`/operational_expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleEdit = (expense) => {
    if (!hasPermission("operational_expenses.edit")) {
      alert("You don't have permission to edit.");
      return;
    }
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCreate = () => {
    if (!hasPermission("operational_expenses.create")) {
      alert("You don't have permission to create.");
      return;
    }
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  return (
    <div className="container-fluid">
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
        <OperationalExpensesList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleCreate}
          budgets={budgets}   
          assets={assets}
          users={users}
        />
      )}

      {showForm && (
        <OperationalExpenseForm
          editingExpense={editingExpense}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default OperationalExpensesPage;
