import React, { useState } from "react";

const JudgeForm = ({ form, setForm, isEditing, handleSubmit, handleClose }) => {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {isEditing ? "Edit Judge" : "Create Judge"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {[
              "first_name",
              "last_name",
              "phone",
              "email",
              "date_of_birth",
              "rank_",
            ].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <label className="form-label">
                  {field
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  type={field === "date_of_birth" ? "date" : "text"}
                  className="form-control"
                  name={field}
                  value={form[field] || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
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

export default JudgeForm;
