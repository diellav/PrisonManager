import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import PrisonerAccountForm from "./PrisonerAccountForm";
import PrisonerAccountsList from "./PrisonerAccountsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const PrisonerAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasPermission("prisoner_accounts.read")) {
      fetchAccounts();
    } else {
      setLoading(false);
      setError("You do not have permission to view prisoner accounts.");
    }
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/prisoner_accounts");
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Error fetching prisoner accounts.");
    } finally {
      setLoading(false);
    }
  };

  const goToCreate = () => {
    if (!hasPermission("prisoner_accounts.create")) return;
    setEditingAccount(null);
    setShowForm(true);
  };

  const onEdit = (acc) => {
    if (!hasPermission("prisoner_accounts.edit")) return;
    setEditingAccount(acc);
    setShowForm(true);
  };

const onDelete = async (id) => {
  if (!hasPermission("prisoner_accounts.delete")) return;
  try {
    await axiosInstance.delete(`/prisoner_accounts/${id}`);
    setAccounts((prevAccounts) =>
      prevAccounts.filter((a) => a.prisoner_account_ID !== id)
    );
  } catch {
    setError("Failed to delete account.");
  }
};


  const onSuccess = () => {
    setShowForm(false);
    fetchAccounts();
  };

  const onCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h2>Prisoner Accounts Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm && (hasPermission("prisoner_accounts.create") || hasPermission("prisoner_accounts.edit")) ? (
        <PrisonerAccountForm
  selectedAccount={editingAccount}
  onSuccess={onSuccess}
  onCancel={onCancel}
/>

      ) : (
        hasPermission("prisoner_accounts.read") && (
          <PrisonerAccountsList
            accounts={accounts}
            onEdit={onEdit}
            onDelete={onDelete}
            goToCreate={goToCreate}
          />
        )
      )}
    </div>
  );
};

export default PrisonerAccountsPage;