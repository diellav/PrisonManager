import React, { useEffect, useState } from "react";
import axios from "axios";

const LawyerForm = ({ editingLawyer, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    category: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingLawyer) {
      setForm({
        first_name: editingLawyer.first_name || "",
        last_name: editingLawyer.last_name || "",
        phone: editingLawyer.phone || "",
        email: editingLawyer.email || "",
        category: editingLawyer.category || "",
      });
    }
  }, [editingLawyer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLawyer) {
        await axios.put(`http://localhost:5000/api/lawyers/${editingLawyer.lawyer_ID}`, form);
      } else {
        await axios.post("http://localhost:5000/api/lawyers", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving lawyer:", err);
      setError("Failed to save lawyer");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingLawyer ? "Edit Lawyer" : "Create Lawyer"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {["first_name", "last_name", "phone", "email", "category"].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <label>{field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</label>
                <input
                  type="text"
                  className="form-control"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingLawyer ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LawyerForm;