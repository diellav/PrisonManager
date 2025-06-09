import React from "react";

const TransportList = ({ transports, onEdit, onDelete, goToCreate, prisoners, guards, vehicles }) => {
  const getPrisonerName = (id) => {
    const p = prisoners.find((x) => x.prisonerID === id);
    return p ? `${p.first_name} ${p.last_name}` : "Unknown";
  };

  const getGuardName = (id) => {
    const g = guards.find((x) => x.guard_staff_ID === id);
    return g ? `${g.first_name} ${g.last_name}` : "Unknown";
  };

  const getVehicleName = (id) => {
    const v = vehicles.find((x) => x.vehicle_ID === id);
    return v ? v.vehicle_name : "Unknown";
  };

  return (
    <div>
      <button className="btn btn-primary mb-3" onClick={goToCreate}>
        Create New Transport
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Prisoner</th>
            <th>Departure</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Guard</th>
            <th>Vehicle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transports.map((t) => (
            <tr key={t.transport_ID}>
              <td>{getPrisonerName(t.prisonerID)}</td>
              <td>{t.departure_location}</td>
              <td>{t.destination_location}</td>
              <td>{t.transport_date?.split("T")[0]}</td>
              <td>{t.transport_reason}</td>
              <td>{t.status_}</td>
              <td>{getGuardName(t.guard_ID)}</td>
              <td>{getVehicleName(t.vehicle_ID)}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(t)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.transport_ID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransportList;
