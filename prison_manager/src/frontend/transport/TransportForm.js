
import React from "react";

const TransportForm = ({ form, setForm, isEditing, handleSubmit, handleClose }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">{isEditing ? "Edit Transport" : "Create Transport"}</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {[
              { name: "prisonerID", label: "Prisoner ID", type: "number" },
              { name: "departure_location", label: "Departure Location", type: "text" },
              { name: "destination_location", label: "Destination Location", type: "text" },
              { name: "transport_date", label: "Transport Date", type: "date" },
              { name: "transport_reason", label: "Transport Reason", type: "text" },
              { name: "status_", label: "Status", type: "text" },
              { name: "guard_ID", label: "Guard ID", type: "number" },
              { name: "vehicle_ID", label: "Vehicle ID", type: "number" },
            ].map(({ name, label, type }) => (
              <div className="form-group col-md-6" key={name}>
                <label>{label}</label>
                <input
                  type={type}
                  className="form-control"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary mr-2">{isEditing ? "Update" : "Create"}</button>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TransportForm;
