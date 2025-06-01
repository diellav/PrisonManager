import React, { useState } from "react";

const ParoleList = ({ paroles, prisoners, onEdit, onDelete, goToCreate }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("parole_ID");
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

  const getPrisonerName = (id) => {
    const prisoner = prisoners?.find((p) => p.prisonerID === id);
    return prisoner ? `${prisoner.first_name} ${prisoner.last_name}` : id;
  };

  const sortedParoles = [...paroles]
    .filter((parole) =>
      Object.values(parole).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
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
  const currentParoles = sortedParoles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedParoles.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderSortIcons = (field) => {
    const active = sortField === field;
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
        <span style={{ color, opacity: active && sortDirection === "asc" ? 1 : 0.3 }}>▲</span>
        <span style={{ color, opacity: active && sortDirection === "desc" ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  return (
    <div>
      <div className="card shadow-sm mb-4 border-0">
        <div
          className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom"
          style={{ backgroundColor: "#4E73DF" }}
        >
          <h4 className="m-0 text-primary fw-bold">Parole List</h4>
          {hasPermission("paroles.create") && (
            <button className="btn btn-primary" onClick={goToCreate}>
              + Add Parole
            </button>
          )}
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  {[
                    { field: "parole_ID", label: "ID" },
                    { field: "prisonerID", label: "Prisoner" },
                    { field: "request_date", label: "Request Date" },
                    { field: "decision_date", label: "Decision Date" },
                    { field: "status_", label: "Status" },
                    { field: "conditions", label: "Conditions" },
                    { field: "notes", label: "Notes" },
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      style={{
                        cursor: "pointer",
                        color: "white",
                        backgroundColor: "#4E73DF",
                      }}
                    >
                      {label} {renderSortIcons(field)}
                    </th>
                  ))}
                  {(hasPermission("paroles.edit") || hasPermission("paroles.delete")) && (
                    <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentParoles.length > 0 ? (
                  currentParoles.map((parole) => (
                    <tr key={parole.parole_ID}>
                      <td>{parole.parole_ID}</td>
                      <td>{getPrisonerName(parole.prisonerID)}</td>
                      <td>{parole.request_date?.split("T")[0]}</td>
                      <td>{parole.decision_date?.split("T")[0]}</td>
                      <td>{parole.status_}</td>
                      <td>{parole.conditions}</td>
                      <td>{parole.notes}</td>
                      {(hasPermission("paroles.edit") || hasPermission("paroles.delete")) && (
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {hasPermission("paroles.edit") && (
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => onEdit(parole)}
                              >
                                Edit
                              </button>
                            )}
                            {hasPermission("paroles.delete") && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setDeleteId(parole.parole_ID);
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
                    <td colSpan="8" className="text-center text-muted py-3">
                      No paroles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                  <p>Are you sure you want to delete this parole record?</p>
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
                    Delete
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

export default ParoleList;
