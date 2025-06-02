import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import AssetForm from "./AssetsForm";
import AssetList from "./AssetsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("assets.read")) {
      fetchAssets();
    } else {
      showAlert("You don't have permission to view assets.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/assets");
      setAssets(res.data);
      setAlert({ message: "", type: "" });
    } catch (err) {
      console.error("Error fetching assets:", err.response?.data || err.message);
      showAlert("Failed to fetch assets.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asset) => {
    if (!hasPermission("assets.edit")) {
      return showAlert("You don't have permission to edit assets.", "danger");
    }
    setForm(asset);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("assets.delete")) {
      return showAlert("You don't have permission to delete assets.", "danger");
    }
    try {
      await axiosInstance.delete(`/assets/${id}`);
      fetchAssets();
    } catch (err) {
      console.error("Error deleting asset:", err.response?.data || err.message);
      showAlert("Failed to delete asset.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("assets.create")) {
      return showAlert("You don't have permission to create assets.", "danger");
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
      <h2>Asset Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <AssetForm
          editingAsset={isEditing ? form : null}
          onSuccess={() => {
            setShowModal(false);
            fetchAssets();
            setIsEditing(false);
            setForm(null);
          }}
          onCancel={handleModalClose}
        />
      ) : hasPermission("assets.read") ? (
        <AssetList
          assets={assets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
        />
      ) : (
        <p>You do not have permission to view assets.</p>
      )}
    </div>
  );
};

export default AssetsPage;
