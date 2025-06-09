import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import StoreItemsForm from "./StoreItemsForm";
import StoreItemsList from "./StoreItemsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const StoreItemsPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item_ID: null,
    name_: "",
    price: "",
    category: "",
    stock_quantity: "",
    last_restocked: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("store_items.read")) {
      fetchItems();
    }
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/store_items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching store items:", err.response?.data || err.message);
    }
  };

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing && hasPermission("store_items.edit")) {
        await axiosInstance.put(`/store_items/${form.item_ID}`, form);
      } else if (!isEditing && hasPermission("store_items.create")) {
        await axiosInstance.post("/store_items", form);
      } else {
        return showAlert("You don't have permission to perform this action.", "danger");
      }

      setShowForm(false);
      fetchItems();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        showAlert("Access denied: You do not have permission.", "danger");
      } else if (
        error.response?.status === 500 &&
        error.response.data?.includes("duplicate key")
      ) {
        showAlert("Item already exists.", "danger");
      } else {
        showAlert("Failed to save item. Please try again.", "danger");
      }
      console.error("Failed to save item:", error.response?.data || error.message);
    }
  };

  const handleEdit = async (item) => {
    if (!hasPermission("store_items.edit")) {
      alert("No permission to edit store items.");
      return;
    }

    try {
      const res = await axiosInstance.get(`/store_items/${item.item_ID}`);
      const data = res.data;

      const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      };

      setForm({
        item_ID: data.item_ID,
        name_: data.name_ || "",
        price: data.price || "",
        category: data.category || "",
        stock_quantity: data.stock_quantity || "",
        last_restocked: formatDate(data.last_restocked),
      });

      setIsEditing(true);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert("Failed to fetch item details.");
      console.error("Error fetching item:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("store_items.delete")) return showAlert("No permission to delete items.", "danger");

    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axiosInstance.delete(`/store_items/${id}`);
        fetchItems();
      } catch (err) {
        showAlert("Failed to delete item.", "danger");
        console.error("Error deleting item:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    if (!hasPermission("store_items.create")) return showAlert("No permission to create items.", "danger");
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      item_ID: null,
      name_: "",
      price: "",
      category: "",
      stock_quantity: "",
      last_restocked: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Store Items Management</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {showForm && (
        <StoreItemsForm
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          handleClose={() => setShowForm(false)}
        />
      )}

      {!showForm && (
        <StoreItemsList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleGoToCreate}
        />
      )}
    </div>
  );
};

export default StoreItemsPage;
