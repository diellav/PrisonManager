import React, { useState, useEffect } from "react";

const MedicalRecordForm = ({
  onSubmit,
  record,
  prisoners = [],
  medicalStaff = [],
  users = [],
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    record_ID: record?.medical_record_ID || 0, 
    prisonerID: record?.prisonerID || "",
    medical_staff_ID: record?.medical_staff_ID || "",
    diagnosis: record?.diagnosis || "",
    treatment: record?.treatment || "",
    medications: record?.medications || "", 
  });

  useEffect(() => {
    setFormData({
      record_ID: record?.medical_record_ID || 0,
      prisonerID: record?.prisonerID || "",
      medical_staff_ID: record?.medical_staff_ID || "",
      diagnosis: record?.diagnosis || "",
      treatment: record?.treatment || "",
      medications: record?.medications || "",
    });
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const getMedicalStaffName = (id) => {
    const staff = medicalStaff.find((m) => m.medical_staff_ID === id);
    if (!staff) return "Unknown";
    const user = users.find((u) => u.userID === staff.userID);
    return user ? `${user.first_name} ${user.last_name}` : "Unknown";
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white border-bottom">
        <h4 className="text-primary fw-bold m-0">
          {formData.record_ID ? "Edit Medical Record" : "Create Medical Record"}
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Prisoner</label>
              <select
                className="form-select"
                name="prisonerID"
                value={formData.prisonerID}
                onChange={handleChange}
                required
              >
                <option value="">Select Prisoner</option>
                {prisoners.map((p) => (
                  <option key={p.prisonerID} value={p.prisonerID}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Medical Staff</label>
              <select
                className="form-select"
                name="medical_staff_ID"
                value={formData.medical_staff_ID}
                onChange={handleChange}
                required
              >
                <option value="">Select Medical Staff</option>
                {medicalStaff.map((s) => (
                  <option key={s.medical_staff_ID} value={s.medical_staff_ID}>
                    {getMedicalStaffName(s.medical_staff_ID)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Diagnosis</label>
              <input
                type="text"
                className="form-control"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Treatment</label>
              <input
                type="text"
                className="form-control"
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Medications</label>
            <input
              type="text"
              className="form-control"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {formData.record_ID ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }
};

export default MedicalRecordForm;
