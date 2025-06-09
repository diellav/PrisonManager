
import React from "react";

const TransportList = ({ transports, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <button className="btn btn-success mb-3" onClick={goToCreate}>Add Transport</button>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Prisoner ID</th>
            <th>Departure</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Guard ID</th>
            <th>Vehicle ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transports.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">No records found</td>
            </tr>
          ) : (
            transports.map((t) => (
              <tr key={t.transport_ID}>
                <td>{t.transport_ID}</td>
                <td>{t.prisonerID}</td>
                <td>{t.departure_location}</td>
                <td>{t.destination_location}</td>
                <td>{new Date(t.transport_date).toLocaleDateString()}</td>
                <td>{t.transport_reason}</td>
                <td>{t.status_}</td>
                <td>{t.guard_ID}</td>
                <td>{t.vehicle_ID}</td>
                <td>
                  <button className="btn btn-sm btn-primary mr-2" onClick={() => onEdit(t)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(t.transport_ID)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransportList;
