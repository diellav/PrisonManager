import React, { useState } from "react";

const MaintenanceStaffForm = ({
  form,
  isEditing,
  handleInputChange,
  handleSubmit,
  handleClose,
}) => {
  const [error, setError] = useState("");

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {isEditing ? "Edit Maintenance Role" : "Create Maintenance Staff"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-3">
            <label htmlFor="maintenance_role" className="form-label">
              Maintenance Role
            </label>
            <input
              type="text"
              id="maintenance_role"
              name="maintenance_role"
              className="form-control"
              value={form.maintenance_role || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceStaffForm;
