import React, { useState } from "react";

const TransportStaffForm = ({
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
          {isEditing ? "Edit Transport Role" : "Create Transport Staff"}
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
            <label htmlFor="transport_role" className="form-label">
              Transport Role
            </label>
            <input
              type="text"
              id="transport_role"
              name="transport_role"
              className="form-control"
              value={form.transport_role || ""}
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

export default TransportStaffForm;
