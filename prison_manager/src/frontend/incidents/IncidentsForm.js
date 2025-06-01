import React, { useState} from "react";

const IncidentsForm = ({
  form,
  setForm,
  isEditing,
  prisoners,
  handleSubmit,
  handleClose,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  const handlePrisonerToggle = (prisonerID) => {
    setForm((prev) => {
      const updated = prev.prisonerIDs.includes(prisonerID)
        ? prev.prisonerIDs.filter((id) => id !== prisonerID)
        : [...prev.prisonerIDs, prisonerID];
      return { ...prev, prisonerIDs: updated };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (form.prisonerIDs.length === 0) {
      setConfirmMessage("Please select at least one prisoner involved in the incident.");
      setShowConfirm(true);
      return;
    }

    handleSubmit(e);
  };

  return (
    <>
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">{isEditing ? "Edit Incident" : "Report Incident"}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Date Reported</label>
              <input
                type="date"
                className="form-control"
                required
                value={form.date_reported}
                onChange={(e) => setForm({ ...form, date_reported: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Severity</label>
              <input
                type="text"
                className="form-control"
                required
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Resolved</label>
              <select
                className="form-control"
                required
                value={form.resolved}
                onChange={(e) => setForm({ ...form, resolved: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Follow-up Actions</label>
              <textarea
                className="form-control"
                rows={3}
                required
                value={form.follow_up_actions}
                onChange={(e) => setForm({ ...form, follow_up_actions: e.target.value })}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Prisoners Involved</label>
              <div className="row">
                {prisoners.map((prisoner) => (
                  <div className="col-md-4 mb-2" key={prisoner.prisonerID}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`prisoner-${prisoner.prisonerID}`}
                        checked={form.prisonerIDs.includes(prisoner.prisonerID)}
                        onChange={() => handlePrisonerToggle(prisoner.prisonerID)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`prisoner-${prisoner.prisonerID}`}
                      >
                        {prisoner.first_name} {prisoner.last_name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? "Update Incident" : "Report Incident"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirm && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Validation Error</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{confirmMessage}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowConfirm(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default IncidentsForm;
