import React, { useState, useMemo } from "react";

const groupIncidents = (rawData) => {
  const incidentsMap = {};

  rawData.forEach(row => {
    if (!incidentsMap[row.incident_ID]) {
      incidentsMap[row.incident_ID] = {
        incidentID: row.incident_ID,
        date_reported: row.date_reported,
        severity: row.severity,
        resolved: row.resolved,
        follow_up_actions: row.follow_up_actions,
        prisoners: []
      };
    }

    if (row.prisoner_ID) {
      incidentsMap[row.incident_ID].prisoners.push({
        prisonerID: row.prisoner_ID,
        first_name: row.first_name,
        last_name: row.last_name
      });
    }
  });

  return Object.values(incidentsMap);
};

const IncidentsList = ({ incidents, onEdit, onDelete, goToCreate }) => {
  console.log("Raw Incidents Data:", incidents);

  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const groupedIncidents = useMemo(() => {
    const grouped = groupIncidents(incidents);
    console.log("Grouped Incidents:", grouped);
    return grouped;
  }, [incidents]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("incidentID");
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
    const color = active ? "white" : "#343a40";
    const activeAsc = active && sortDirection === "asc";
    const activeDesc = active && sortDirection === "desc";

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

  const filteredIncidents = [...groupedIncidents]
    .filter((inc) =>
      [inc.incidentID, inc.date_reported, inc.severity, inc.resolved, inc.follow_up_actions]
        .some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
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
  const currentIncidents = filteredIncidents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
        <h4 className="m-0 text-primary fw-bold">Incidents List</h4>
        {hasPermission("incidents.create") && (
          <button className="btn btn-primary" onClick={goToCreate}>
            + Report Incident
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
                {[
                  { field: "incidentID", label: "ID" },
                  { field: "date_reported", label: "Date Reported" },
                  { field: "severity", label: "Severity" },
                  { field: "resolved", label: "Resolved" },
                  { field: "follow_up_actions", label: "Follow-up Actions" },
                ].map(({ field, label }) => (
                  <th
                    key={field}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                    onClick={() => handleSort(field)}
                  >
                    {label} {renderSortIcons(field)}
                  </th>
                ))}
                <th style={{ backgroundColor: "#4E73DF", color: "white" }}>Prisoners Involved</th>
                {(hasPermission("incidents.edit") || hasPermission("incidents.delete")) && (
                  <th style={{ backgroundColor: "#4E73DF", color: "white" }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentIncidents.length > 0 ? (
                currentIncidents.map((inc) => (
                  <tr key={inc.incidentID}>
                    <td>{inc.incidentID}</td>
                    <td>{new Date(inc.date_reported).toISOString().split("T")[0]}</td>
                    <td>{inc.severity}</td>
                    <td>{inc.resolved}</td>
                    <td>{inc.follow_up_actions}</td>
                    <td>
                      {inc.prisoners && inc.prisoners.length > 0 ? (
                        inc.prisoners.map(p => `${p.first_name} ${p.last_name}`).join(", ")
                      ) : (
                        <span>No prisoners</span>
                      )}
                    </td>
                    {(hasPermission("incidents.edit") || hasPermission("incidents.delete")) && (
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {hasPermission("incidents.edit") && (
                            <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(inc)}>
                              Edit
                            </button>
                          )}
                          {hasPermission("incidents.delete") && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setDeleteId(inc.incidentID);
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
                  <td colSpan={7} className="text-center text-muted py-3">
                    No incidents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <div className="small text-muted mb-2 mb-md-0">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredIncidents.length)} of{" "}
            {filteredIncidents.length} entries
          </div>
          <ul className="pagination mb-0 mt-2 mt-md-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                Prev
              </button>
            </li>
            {pageNumbers.map((n) => (
              <li key={n} className={`page-item ${currentPage === n ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(n)}>
                  {n}
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
                  <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
                </div>
                <div className="modal-body">
                <p>Are you sure you want to delete incident #{deleteId}?</p>
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

export default IncidentsList;
