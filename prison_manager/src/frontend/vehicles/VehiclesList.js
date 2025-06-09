// VehiclesList.js
import React, { useState } from "react";

const VehiclesList = ({ vehicles, onEdit, onDelete, goToCreate }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("vehicle_ID");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const renderSortIcons = (field) => {
    const active = sortField === field;
    const activeAsc = active && sortDirection === "asc";
    const activeDesc = active && sortDirection === "desc";
    const color = active ? "white" : "#343a40";
    return (
      <span className="ms-1 d-inline-flex flex-column" style={{ fontSize: "0.7rem", lineHeight: "0.7rem", transform: "translateY(-7px)" }}>
        <span style={{ color, opacity: activeAsc ? 1 : 0.3 }}>▲</span>
        <span style={{ color, opacity: activeDesc ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  const filteredVehicles = [...vehicles]
    .filter((v) =>
      [v.vehicle_ID, v.plate_number, v.type_, v.capacity, v.status_, v.transport_staff_ID]
        .some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#4E73DF" }}>
          <h4 className="m-0 text-primary fw-bold">Vehicles List</h4>
          {hasPermission("vehicles.create") && <button className="btn btn-primary" onClick={goToCreate}>+ Add Vehicle</button>}
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="d-flex align-items-center gap-2">
                Show
                <select
                  className="form-select form-select-sm"
                  style={{ width: "80px" }}
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                entries
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ maxWidth: "300px" }}
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  {[
                    { field: "vehicle_ID", label: "ID" },
                    { field: "plate_number", label: "Plate Number" },
                    { field: "type_", label: "Type" },
                    { field: "capacity", label: "Capacity" },
                    { field: "status_", label: "Status" },
                    { field: "transport_staff_ID", label: "Transport Staff ID" },
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                    >
                      {label} {renderSortIcons(field)}
                    </th>
                  ))}
                  {(hasPermission("vehicles.edit") || hasPermission("vehicles.delete")) && (
                    <th style={{ backgroundColor: "#4E73DF", color: "white" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentVehicles.length > 0 ? (
                  currentVehicles.map((vehicle) => (
                    <tr key={vehicle.vehicle_ID}>
                      <td>{vehicle.vehicle_ID}</td>
                      <td>{vehicle.plate_number}</td>
                      <td>{vehicle.type_}</td>
                      <td>{vehicle.capacity}</td>
                      <td>{vehicle.status_}</td>
                      <td>{vehicle.transport_staff_ID}</td>
                      {(hasPermission("vehicles.edit") || hasPermission("vehicles.delete")) && (
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {hasPermission("vehicles.edit") && <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(vehicle)}>Edit</button>}
                            {hasPermission("vehicles.delete") && <button className="btn btn-sm btn-outline-danger" onClick={() => { setDeleteId(vehicle.vehicle_ID); setShowConfirm(true); }}>Delete</button>}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="text-center text-muted py-3">No vehicles found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredVehicles.length)} of {filteredVehicles.length} entries
            </div>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Prev</button>
              </li>
              {pageNumbers.map((num) => (
                <li key={num} className={`page-item ${currentPage === num ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(num)}>{num}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this vehicle?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onDelete(deleteId);
                    setShowConfirm(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;
