import React, { useState } from "react";

const TransportList = ({ transports, onEdit, onDelete, goToCreate, prisoners, guards, vehicles }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("transport_date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
    return v ? v.plate_number : "Unknown";
  };

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

  const sortedTransports = [...transports]
    .filter((t) => {
      const values = [
        getPrisonerName(t.prisonerID),
        t.departure_location,
        t.destination_location,
        t.transport_date,
        t.transport_reason,
        t.status_,
        getGuardName(t.guard_ID),
        getVehicleName(t.vehicle_ID),
      ]
        .join(" ")
        .toLowerCase();
      return values.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransports = sortedTransports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedTransports.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderSortIcons = (field) => {
    const active = sortField === field;
    const activeAsc = active && sortDirection === "asc";
    const activeDesc = active && sortDirection === "desc";
    const color = active ? "white" : "#343a40";

    return (
      <span
        className="ms-1 d-inline-flex flex-column"
        style={{
          fontSize: "0.7rem",
          lineHeight: "0.7rem",
          transform: "translateY(-7px)",
        }}
      >
        <span style={{ color, opacity: activeAsc ? 1 : 0.3 }}>▲</span>
        <span style={{ color, opacity: activeDesc ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
        <h4 className="m-0 text-primary fw-bold">Transport List</h4>
        <button className="btn btn-primary" onClick={goToCreate}>
          + Add Transport
        </button>
      </div>

      <div className="card-body">
        <div className="row mb-3 align-items-center">
          <div className="col-md-6 d-flex align-items-center">
            <label className="d-flex align-items-center" style={{ gap: "10px" }}>
              Show
              <select
                className="form-select form-select-sm"
                style={{ width: "80px" }}
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              entries
            </label>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end justify-content-start mt-2 mt-md-0">
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
                {["Prisoner", "Departure", "Destination", "Date", "Reason", "Status", "Guard", "Vehicle"].map((label, index) => (
                  <th
                    key={label}
                    className="sortable"
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => handleSort(["prisonerID", "departure_location", "destination_location", "transport_date", "transport_reason", "status_", "guard_ID", "vehicle_ID"][index])}
                  >
                    {label} {renderSortIcons(["prisonerID", "departure_location", "destination_location", "transport_date", "transport_reason", "status_", "guard_ID", "vehicle_ID"][index])}
                  </th>
                ))}
                <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransports.length > 0 ? (
                currentTransports.map((t) => (
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
                      <div style={{ display: "flex", gap: "6px" }}>
                        {hasPermission("transport.edit") && (
                          <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(t)}>
                            Edit
                          </button>
                        )}
                        {hasPermission("transport.delete") && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => {
                            setDeleteId(t.transport_ID);
                            setShowConfirm(true);
                          }}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-3">
                    No transports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <div className="small text-muted mb-2 mb-md-0">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedTransports.length)} of {sortedTransports.length} entries
          </div>
          <ul className="pagination mb-0 mt-2 mt-md-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                Prev
              </button>
            </li>
            {pageNumbers.map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(number)}>
                  {number}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>

      {showConfirm && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this transport?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={() => {
                    onDelete(deleteId);
                    setShowConfirm(false);
                  }}>
                    Yes, I'm sure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransportList;