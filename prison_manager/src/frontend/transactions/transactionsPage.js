import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import TransactionsForm from "./transactionsForm";
import TransactionsList from "./transactionsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [prisoners, setPrisoners] = useState([]);
  const [form, setForm] = useState({
    prisonerID: "",
    reference_of_purchase: "",
    amount: "",
    type_: "",
    date_: "",
    transaction_ID: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("transactions.read")) {
      fetchTransactions();
      fetchPurchases();
      fetchPrisoners();
    } else {
      showAlert("You don't have permission to view transactions.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      showAlert("Error fetching transactions.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await axiosInstance.get("/prison_purchases");
      setPurchases(res.data);
    } catch (err) {
      showAlert("Error fetching prison purchases.", "danger");
    }
  };

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      showAlert("Error fetching prisoners.", "danger");
    }
  };

  const resetForm = () => {
    setForm({
      prisonerID: "",
      reference_of_purchase: "",
      amount: "",
      type_: "",
      date_: "",
      transaction_ID: null,
    });
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    resetForm();
    fetchTransactions();
  };

  const handleFormCancel = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (transaction) => {
    if (!hasPermission("transactions.edit")) {
      return showAlert("You don't have permission to edit transactions.", "danger");
    }

    setForm({
      prisonerID: transaction.prisonerID,
      reference_of_purchase: transaction.reference_of_purchase,
      amount: transaction.amount,
      type_: transaction.type_,
      date_: transaction.date_?.split("T")[0] || "",
      transaction_ID: transaction.transaction_ID,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("transactions.delete")) {
      return showAlert("You don't have permission to delete transactions.", "danger");
    }

    try {
      await axiosInstance.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      showAlert("Failed to delete transaction.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("transactions.create")) {
      return showAlert("You don't have permission to create transactions.", "danger");
    }
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Transaction Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <TransactionsForm
          editingTransaction={isEditing ? form : null}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          prisoners={prisoners}
          purchases={purchases}
        />
      ) : hasPermission("transactions.read") ? (
        <TransactionsList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
          prisoners={prisoners}
          purchases={purchases}
        />
      ) : (
        <p>You do not have permission to view transactions.</p>
      )}
    </div>
  );
};

export default TransactionsPage;
