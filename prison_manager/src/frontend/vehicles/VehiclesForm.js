// VehiclesForm.js
import React, { useState } from "react";

const VehiclesForm = ({ form, setForm, isEditing, handleSubmit, handleClose }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">{isEditing ? "Edit Vehicle" : "Create Vehicle"}</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {["plate_number", "type_", "capacity", "status_", "transport_staff_ID"].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <label className="form-label">{field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</label>
                <input
                  type={field === "capacity" || field === "transport_staff_ID" ? "number" : "text"}
                  className="form-control"
                  name={field}
                  value={form[field] || ""}
                  onChange={handleChange}
                  required
                  min={field === "capacity" || field === "transport_staff_ID" ? 1 : undefined}
                />
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiclesForm;
