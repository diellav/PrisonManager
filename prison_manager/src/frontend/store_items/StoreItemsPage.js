import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import StoreItemsForm from "./StoreItemsForm";
import StoreItemsList from "./StoreItemsList";

const hasPermission = (perm) =>
  JSON.parse(localStorage.getItem("permissions") || "[]").includes(
    perm.toLowerCase()
  );

const StoreItemsPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    store_item_ID: null,
    name_: "",
    price: "",
    category: "",
    stock_quantity: "",
    last_restocked: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal] = useState({ visible: false, msg: "", type: "warning" });

  useEffect(() => {
    if (hasPermission("store_items.read")) fetchItems();
  }, []);

  const openModal = (msg, type = "warning") =>
    setModal({ visible: true, msg, type });
  const closeModal = () => setModal({ ...modal, visible: false });

  const resetForm = () => {
    setForm({
      store_item_ID: null,
      name_: "",
      price: "",
      category: "",
      stock_quantity: "",
      last_restocked: "",
    });
    setIsEditing(false);
  };

  const fetchItems = async () => {
    try {
      const { data } = await axiosInstance.get("/store_items");
      setItems(data);
    } catch {
      openModal("Failed to fetch items.", "danger");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        if (!hasPermission("store_items.edit"))
          return openModal("No permission to edit.", "danger");
        await axiosInstance.put(`/store_items/${form.store_item_ID}`, form);
      } else {
        if (!hasPermission("store_items.create"))
          return openModal("No permission to create.", "danger");
        await axiosInstance.post("/store_items", form);
      }
      fetchItems();
      resetForm();
      setShowForm(false);
    } catch (err) {
      const d = err.response?.data || "";
      if (err.response?.status === 403) return openModal("Access denied.", "danger");
      if (String(d).includes("duplicate")) return openModal("Item exists.", "danger");
      openModal("Failed to save item.", "danger");
    }
  };

  const handleEdit = async ({ store_item_ID }) => {
    if (!hasPermission("store_items.edit"))
      return openModal("No permission to edit.", "danger");
    try {
      const { data } = await axiosInstance.get(`/store_items/${store_item_ID}`);
      setForm({
        store_item_ID: data.store_item_ID,
        name_: data.name_ || "",
        price: data.price || "",
        category: data.category || "",
        stock_quantity: data.stock_quantity || "",
        last_restocked: data.last_restocked
          ? new Date(data.last_restocked).toISOString().split("T")[0]
          : "",
      });
      setIsEditing(true);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      openModal("Failed to load item.", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("store_items.delete"))
      return openModal("No permission to delete.", "danger");
    try {
      await axiosInstance.delete(`/store_items/${id}`);
      fetchItems();
    } catch {
      openModal("Failed to delete item.", "danger");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Store Items Management</h2>

      {modal.visible && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} />
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,.5)", zIndex: 1055 }}
          >
            <div className="modal-dialog">
              <div className="modal-content border-0">
                <div className={`modal-header bg-${modal.type}`}>
                  <h5 className="modal-title text-white">Info</h5>
                </div>
                <div className="modal-body">
                  <p>{modal.msg}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={closeModal}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showForm ? (
        <StoreItemsForm
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          handleClose={() => {
            resetForm();
            setShowForm(false);
          }}
        />
      ) : (
        <StoreItemsList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={() => {
            resetForm();
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
};

export default StoreItemsPage;