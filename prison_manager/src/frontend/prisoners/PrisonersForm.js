import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const PrisonersForm = ({
  form,
  isEditing,
  handleInputChange,
  handleSubmit,
  handleClose,
  setFile, 
}) => {
  const [cells, setCells] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cellsRes, contactsRes] = await Promise.all([
          axiosInstance.get("/cells"),
          axiosInstance.get("/emergency_contacts"),
        ]);
        setCells(cellsRes.data);
        setContacts(contactsRes.data);
      } catch (err) {
        console.error("Error fetching cells or contacts:", err);
        setError("Failed to load cell blocks or emergency contacts.");
      }
    };
    fetchData();
  }, []);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {isEditing ? "Edit Prisoner" : "Create Prisoner"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          encType="multipart/form-data"
        >
          <div className="row">
            {[
              { label: "First Name", name: "first_name" },
              { label: "Last Name", name: "last_name" },
              { label: "Date of Birth", name: "date_of_birth", type: "date" },
              { label: "National ID", name: "national_id" },
              { label: "Address", name: "address_" },
              { label: "Sentence Start", name: "sentence_start", type: "date" },
              { label: "Sentence End", name: "sentence_end", type: "date" },
              { label: "Status", name: "status_" },
              { label: "Rank", name: "rank_" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name} className="col-md-6 mb-3">
                <label>{label}</label>
                <input
                  type={type}
                  className="form-control"
                  name={name}
                  value={form[name] || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}

            <div className="col-md-6 mb-3">
              <label>Photo</label>
              <input
                type="file"
                className="form-control"
                name="photo"
                onChange={onFileChange}
                accept="image/*"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Gender</label>
              <select
                className="form-control"
                name="gender"
                value={form.gender || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label>Cell Block & Cell</label>
              <select
                className="form-control"
                name="cell_block_ID"
                value={form.cell_block_ID || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Cell Block & Cell</option>
                {cells.map((cell) => (
                  <option key={cell.cell_block_ID} value={cell.cell_block_ID}>
                    {`Block: ${cell.block_name} - Cell: ${cell.cell_number}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label>Emergency Contact</label>
              <select
                className="form-control"
                name="emergency_contact_ID"
                value={form.emergency_contact_ID || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Emergency Contact</option>
                {contacts.map((contact) => (
                  <option
                    key={contact.emergency_contact_ID}
                    value={contact.emergency_contact_ID}
                  >
                    {`${contact.first_name} ${contact.last_name}`}
                  </option>
                ))}
              </select>
            </div>
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

export default PrisonersForm;
