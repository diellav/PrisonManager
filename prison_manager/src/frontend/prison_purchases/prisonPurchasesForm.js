import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";

const PrisonPurchasesForm = ({ editingPurchase, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    store_item_ID: "",
    quantity: "",
    total_price: "",
    date_: "",
    prisoner_account_ID: "",
    approved_by: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingPurchase) {
      setForm({
        store_item_ID: editingPurchase.store_item_ID?.toString() || "",
        quantity: editingPurchase.quantity?.toString() || "",
        total_price: editingPurchase.total_price?.toString() || "",
        date_: editingPurchase.date_
          ? editingPurchase.date_.substring(0, 10)
          : "",
        prisoner_account_ID:
          editingPurchase.prisoner_account_ID?.toString() || "",
        approved_by: editingPurchase.approved_by?.toString() || "",
      });
    }
  }, [editingPurchase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const purchaseData = {
      store_item_ID: form.store_item_ID ? parseInt(form.store_item_ID) : null,
      quantity: parseInt(form.quantity),
      total_price: parseFloat(form.total_price),
      date_: form.date_,
      prisoner_account_ID: parseInt(form.prisoner_account_ID),
      approved_by: parseInt(form.approved_by),
    };

    try {
      if (editingPurchase && editingPurchase.prison_purchase_ID) {
        await axiosInstance.put(
          `/prison-purchases/${editingPurchase.prison_purchase_ID}`,
          purchaseData
        );
      } else {
        await axiosInstance.post("/prison-purchases", purchaseData);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving purchase:", err);
      setError("Failed to save purchase.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingPurchase ? "Edit Purchase" : "Create Purchase"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Store Item ID</label>
              <input
                type="number"
                name="store_item_ID"
                className="form-control"
                value={form.store_item_ID}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Total Price</label>
              <input
                type="number"
                step="0.01"
                name="total_price"
                className="form-control"
                value={form.total_price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Date</label>
              <input
                type="date"
                name="date_"
                className="form-control"
                value={form.date_}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Prisoner Account ID</label>
              <input
                type="number"
                name="prisoner_account_ID"
                className="form-control"
                value={form.prisoner_account_ID}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Approved By (Guard ID)</label>
              <input
                type="number"
                name="approved_by"
                className="form-control"
                value={form.approved_by}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPurchase ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrisonPurchasesForm;
