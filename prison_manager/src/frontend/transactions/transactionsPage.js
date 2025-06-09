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

  const [form, setForm] = useState({
    transaction_ID: null,
    prisonerID: "",
    reference_of_purchase: "",
    amount: "",
    type_: "",
    date_: "",

  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("transactions.read")) fetchTransactions();
  }, []);

  

  const fetchTransactions = async () => {

    try {
      const res = await axiosInstance.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err.response?.data || err.message);
    }
  };

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && hasPermission("transactions.edit")) {
        await axiosInstance.put(`/transactions/${form.transaction_ID}`, form);
      } else if (!isEditing && hasPermission("transactions.create")) {
        await axiosInstance.post("/transactions", form);
      } else {
        return showAlert("You don't have permission to perform this action.", "danger");
      }
      setShowForm(false);
      fetchTransactions();
      resetForm();
    } catch (error) {
      showAlert("Failed to save transaction record.", "danger");
      console.error("Failed to save transaction:", error.response?.data || error.message);
    }
  };

  const handleEdit = async (transaction) => {
    if (!hasPermission("transactions.edit")) {
      alert("No permission to edit transaction records.");
      return;
    }
    try {
      const res = await axiosInstance.get(`/transactions/${transaction.transaction_ID}`);
      const data = res.data;
      const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      setForm({
        transaction_ID: data.transaction_ID,
        prisonerID: data.prisonerID || "",
        reference_of_purchase: data.reference_of_purchase || "",
        amount: data.amount || "",
        type_: data.type_ || "",
        date_: formatDate(data.date_) || "",
      });
      setIsEditing(true);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Failed to fetch transaction details.");
      console.error("Error fetching transaction:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("transactions.delete")) return showAlert("No permission to delete transaction records.", "danger");
    if (window.confirm("Are you sure you want to delete this transaction record?")) {
      try {
        await axiosInstance.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        showAlert("Failed to delete transaction record.", "danger");
        console.error("Error deleting transaction:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    if (!hasPermission("transactions.create")) return showAlert("No permission to create transaction records.", "danger");
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      transaction_ID: null,
      prisonerID: "",
      reference_of_purchase: "",
      amount: "",
      type_: "",
      date_: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Transaction Management</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">{alert.message}</div>
      )}

      {showForm ? (
        <TransactionsForm
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          handleClose={() => setShowForm(false)}
        />
      ) : (
        <TransactionsList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleGoToCreate}
        />

      )}
    </div>
  );
};

export default TransactionsPage;
