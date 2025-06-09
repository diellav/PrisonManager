import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import PrisonPurchaseForm from "./prisonPurchasesForm";
import PrisonPurchasesList from "./prisonPurchasesList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const PrisonPurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [prisonersData, setPrisonersData] = useState([]);
  const [guardsData, setGuardsData] = useState([]);
  const [storeItemsData, setStoreItemsData] = useState([]);
const [prisonerAccountsData, setPrisonerAccountsData] = useState([]);
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("prison_purchases.read")) {
      fetchPrisoners();
      fetchGuards();
      fetchStoreItems();
      fetchPurchases();
      fetchPrisonerAccounts();
    } else {
      showAlert("You don't have permission to view prison purchases.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisonersData(res.data);
    } catch (err) {
      console.error("Error fetching prisoners:", err.response?.data || err.message);
      showAlert("Failed to fetch prisoners.", "danger");
    }
  };

  const fetchGuards = async () => {
    try {
      const res = await axiosInstance.get("/guard_staff");
      setGuardsData(res.data);
    } catch (err) {
      console.error("Error fetching guards:", err.response?.data || err.message);
      showAlert("Failed to fetch guards.", "danger");
    }
  };

  const fetchStoreItems = async () => {
    try {
      const res = await axiosInstance.get("/store_items");
      setStoreItemsData(res.data);
    } catch (err) {
      console.error("Error fetching store items:", err.response?.data || err.message);
      showAlert("Failed to fetch store items.", "danger");
    }
  };

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/prison_purchases");
      setPurchases(res.data);
      setAlert({ message: "", type: "" });
    } catch (err) {
      console.error("Error fetching prison purchases:", err.response?.data || err.message);
      showAlert("Failed to fetch prison purchases.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrisonerAccounts = async () => {
  try {
    const res = await axiosInstance.get("/prisoner_accounts");
    setPrisonerAccountsData(res.data);
  } catch (err) {
    console.error("Error fetching prisoner accounts:", err);
    showAlert("Failed to fetch prisoner accounts.", "danger");
  }
};
  const handleEdit = (purchase) => {
    if (!hasPermission("prison_purchases.edit")) {
      return showAlert("You don't have permission to edit prison purchases.", "danger");
    }
    setForm(purchase);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("prison_purchases.delete")) {
      return showAlert("You don't have permission to delete prison purchases.", "danger");
    }
    try {
      await axiosInstance.delete(`/prison_purchases/${id}`);
      fetchPurchases();
    } catch (err) {
      console.error("Error deleting prison purchase:", err.response?.data || err.message);
      showAlert("Failed to delete prison purchase.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("prison_purchases.create")) {
      return showAlert("You don't have permission to create prison purchases.", "danger");
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
      <h2>Prison Purchases Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <PrisonPurchaseForm
          editingPurchase={isEditing ? form : null}
          onSuccess={() => {
            setShowModal(false);
            fetchPurchases();
            setIsEditing(false);
            setForm(null);
          }}
          onCancel={handleModalClose}
        />
      ) : hasPermission("prison_purchases.read") ? (
        <PrisonPurchasesList
          prisonPurchases={purchases}
          prisoners={prisonersData}
          guards={guardsData}
          storeItems={storeItemsData}
          prisonerAccounts={prisonerAccountsData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
        />
      ) : (
        <p>You do not have permission to view prison purchases.</p>
      )}
    </div>
  );
};

export default PrisonPurchasesPage;