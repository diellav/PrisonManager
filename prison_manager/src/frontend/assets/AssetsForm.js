import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";

const AssetForm = ({ editingAsset, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    purchase_date: "",
    status_: "",
    location_: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingAsset) {
      setForm({
        name: editingAsset.name || "",
        category: editingAsset.category || "",
        purchase_date: editingAsset.purchase_date
          ? editingAsset.purchase_date.substring(0, 10)
          : "",
        status_: editingAsset.status_ || "",
        location_: editingAsset.location_ || "",
      });
    }
  }, [editingAsset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assetData = {
      name: form.name,
      category: form.category,
      purchase_date: form.purchase_date,
      status_: form.status_,
      location_: form.location_,
    };

    try {
      if (editingAsset && editingAsset.asset_ID) {
        await axiosInstance.put(`/assets/${editingAsset.asset_ID}`, assetData);
      } else {
        await axiosInstance.post("/assets", assetData);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving asset:", err.response?.data || err.message);
      setError("Failed to save asset.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingAsset ? "Edit Asset" : "Create Asset"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Asset Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Category</label>
              <input
                type="text"
                name="category"
                className="form-control"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Status</label>
              <input
                type="text"
                name="status_"
                className="form-control"
                value={form.status_}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Location</label>
              <input
                type="text"
                name="location_"
                className="form-control"
                value={form.location_}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchase_date"
                className="form-control"
                value={form.purchase_date}
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
              {editingAsset ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
