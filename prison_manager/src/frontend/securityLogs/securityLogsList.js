import React, { useState } from "react";

const SecurityLogsList = ({ logs, guards, incidents,onDelete, onEdit, goToCreate }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("security_log_ID");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


const getGuardName = (id) => {
  const guard = guards.find((guard) => guard.guard_staff_ID === id);
  return guard ? `${guard.first_name} ${guard.last_name}` : "Unknown";
};

const getIncidentInfo = (id) => {
  const incident = incidents.find(i => i.incident_ID === id);
  return incident ? `ID: ${id} - Date: ${new Date(incident.date_reported).toLocaleDateString("en-GB")}` : "Unknown";
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

  const renderSortIcons = (field) => {
    const active = sortField === field;
    const color = active ? "white" : "#343a40";
    return (
      <span
        className="ms-1 d-inline-flex flex-column"
        style={{ fontSize: "0.7rem", transform: "translateY(-7px)" }}
      >
        <span style={{ color, opacity: active && sortDirection === "asc" ? 1 : 0.3 }}>▲</span>
        <span style={{ color, opacity: active && sortDirection === "desc" ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  const filteredLogs = [...logs]
    .filter((log) =>
      Object.values({
        ...log,
        guardName: getGuardName(log.reporting_guard_ID),
      }).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "reporting_guard_ID") {
        aVal = getGuardName(a.reporting_guard_ID).toLowerCase();
        bVal = getGuardName(b.reporting_guard_ID).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
        <h4 className="m-0 text-primary fw-bold">Security Logs</h4>
        {hasPermission("security_logs.create") && (
          <button className="btn btn-primary" onClick={goToCreate}>
            + Add Log
          </button>
        )}
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
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
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
                {[ 
                  { field: "security_log_ID", label: "Log ID" },
                  { field: "reporting_guard_ID", label: "Guard Name" }, 
                  { field: "event_type", label: "Event" },
                  { field: "description_", label: "Description" },
                  { field: "location_", label: "Location" },
                  { field: "action_taken", label: "Action Taken" },
                  { field: "incident_ID", label: "Incident ID & Date" },
                  { field: "time_stamp", label: "Timestamp" },
                ].map(({ field, label }) => (
                  <th
                    key={field}
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => handleSort(field)}
                  >
                    {label} {renderSortIcons(field)}
                  </th>
                ))}
                {(hasPermission("security_logs.edit") || hasPermission("security_logs.delete")) && (
                  <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => (
                  <tr key={log.security_log_ID}>
                    <td>{log.security_log_ID}</td>
                    <td>{getGuardName(log.reporting_guard_ID)}</td>
                    <td>{log.event_type}</td>
                    <td>{log.description_}</td>
                    <td>{log.location_}</td>
                    <td>{log.action_taken}</td>
                    <td>{log.incident_ID ? getIncidentInfo(log.incident_ID) : "N/A"}</td>
                    <td>{new Date(log.time_stamp).toLocaleString()}</td>
                    {(hasPermission("security_logs.edit") || hasPermission("security_logs.delete")) && (
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                        {hasPermission("security_logs.edit") && (
                          <button
                             className="btn btn-sm btn-outline-info"
                            onClick={() => onEdit(log)}

                          >
                            Edit
                          </button>
                        )}
                        {hasPermission("security_logs.delete") && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setDeleteId(log.security_log_ID);
                              setShowConfirm(true);
                            }}
                          >
                            Delete
                          </button>
                        )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={(hasPermission("security_logs.edit") || hasPermission("security_logs.delete")) ? 9 : 8} className="text-center text-muted py-3">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <div className="small text-muted mb-2 mb-md-0">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredLogs.length)} of {filteredLogs.length} entries
          </div>
          <ul className="pagination mb-0 mt-2 mt-md-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                Prev
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <li key={num} className={`page-item ${currentPage === num ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(num)}>
                  {num}
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
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                <p>Are you sure you want to delete this log entry?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      onDelete(deleteId);
                      setShowConfirm(false);
                    }}
                  >
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

export default SecurityLogsList;
