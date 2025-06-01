import React, { useState } from "react";

const PrisonerCallList = ({ calls, onEdit, onDelete, goToCreate, prisoners }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("prisoner_call_ID");
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

  const sortedCalls = [...calls]
    .filter((c) =>
      Object.values(c).some((value) =>
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
  const currentCalls = sortedCalls.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedCalls.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderSortIcons = (field) => {
    const active = sortField === field;
    const color = active ? "white" : "#343a40";
    return (
      <span className="ms-1 d-inline-flex flex-column" style={{ fontSize: "0.7rem", lineHeight: "0.7rem", transform: "translateY(-7px)" }}>
        <span style={{ color, opacity: active && sortDirection === "asc" ? 1 : 0.3 }}>▲</span>
        <span style={{ color, opacity: active && sortDirection === "desc" ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom" style={{ backgroundColor: "#4E73DF" }}>
        <h4 className="m-0 text-primary fw-bold">Prisoner Calls</h4>
        {hasPermission("prisoner_calls.create") && (
          <button className="btn btn-primary" onClick={goToCreate}>
            + Add Call
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="row mb-3 align-items-center">
          <div className="col-md-6 d-flex align-items-center">
            <label className="d-flex align-items-center" style={{ gap: "10px" }}>
              Show
              <select className="form-select form-select-sm" style={{ width: "80px" }} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
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
                  { field: "prisoner_call_ID", label: "Call ID" },
                  { field: "call_date", label: "Date" },
                  { field: "duration", label: "Duration" },
                  { field: "prisonerID", label: "Prisoner" },
                ].map(({ field, label }) => (
                  <th key={field} onClick={() => handleSort(field)} style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}>
                    {label} {renderSortIcons(field)}
                  </th>
                ))}
                {(hasPermission("prisoner_calls.edit") || hasPermission("prisoner_calls.delete")) && (
                  <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentCalls.length > 0 ? (
                currentCalls.map((c) => (
                  <tr key={c.prisoner_call_ID}>
                    <td>{c.prisoner_call_ID}</td>
                    <td>{c.call_date?.substring(0, 10)}</td>
                    <td>{c.duration}</td>
                    <td>{getPrisonerName(c.prisonerID)}</td>
                    {(hasPermission("prisoner_calls.edit") || hasPermission("prisoner_calls.delete")) && (
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {hasPermission("prisoner_calls.edit") && (
                            <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(c)}>
                              Edit
                            </button>
                          )}
                          {hasPermission("prisoner_calls.delete") && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setDeleteId(c.prisoner_call_ID);
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
                  <td colSpan="5" className="text-center text-muted py-3">
                    No calls found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <div className="small text-muted mb-2 mb-md-0">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedCalls.length)} of {sortedCalls.length} entries
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
                  <p>Are you sure you want to delete this call?</p>
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

export default PrisonerCallList;
