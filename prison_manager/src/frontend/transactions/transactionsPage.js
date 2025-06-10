import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import TransactionList from "./transactionsList";
import TransactionForm from "./transactionsForm";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [prisoners, setPrisoners] = useState([]);
  const [prisonPurchases, setPrisonPurchases] = useState([]);
  const [users, setUsers] = useState([]);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const transRes = await axiosInstance.get("/transactions");
        setTransactions(transRes.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError("Failed to fetch transactions.");
      }

      try {
        const prisonersRes = await axiosInstance.get("/prisoners");
        setPrisoners(prisonersRes.data);
      } catch (err) {
        console.error("Failed to fetch prisoners:", err);
        setError((prev) =>
          prev ? prev + " Failed to fetch prisoners." : "Failed to fetch prisoners."
        );
      }

      try {
        const purchasesRes = await axiosInstance.get("/prison_purchases");
        setPrisonPurchases(purchasesRes.data);
      } catch (err) {
        console.error("Failed to fetch prison purchases:", err);
        setError((prev) =>
          prev ? prev + " Failed to fetch prison purchases." : "Failed to fetch prison purchases."
        );
      }

      try {
        const usersRes = await axiosInstance.get("/users");
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError((prev) => (prev ? prev + " Failed to fetch users." : "Failed to fetch users."));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/transactions");
      setTransactions(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("transactions.delete")) {
      alert("You don't have permission to delete.");
      return;
    }
    try {
      await axiosInstance.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleEdit = (transaction) => {
    if (!hasPermission("transactions.edit")) {
      alert("You don't have permission to edit.");
      return;
    }
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCreate = () => {
    if (!hasPermission("transactions.create")) {
      alert("You don't have permission to create.");
      return;
    }
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };
  const transactionsWithDetails = transactions.map((t) => {
    const prisoner = prisoners.find((p) => p.prisonerID === t.prisonerID);
    const purchase = prisonPurchases.find((p) => p.prison_purchase_ID === t.prison_purchase_ID);
    return {
      ...t,
      prisonerName: prisoner ? `${prisoner.first_name} ${prisoner.last_name}` : "Unknown",
      purchaseItemName: purchase ? purchase.item_name : "",
    };
  });

  return (
    <div>
      <h2>Transactions</h2>
      {error && <div className="alert alert-danger">{error}</div>}
    
      {showForm ? (
        <TransactionForm
          editingTransaction={editingTransaction}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <TransactionList
          transactions={transactionsWithDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
            prisoners={prisoners} 
          loading={loading}
            goToCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default TransactionPage;
