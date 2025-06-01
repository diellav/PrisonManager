import React, { useState } from "react";

const CourtHearingList = ({ courtHearings, onEdit, onDelete, goToCreate, judges, cases }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("court_hearingID");
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

  const getJudgeName = (id) => {
    const judge = judges?.find((j) => j.judge_ID === id);
    return judge ? `${judge.first_name} ${judge.last_name}` : id;
  };

  const getCaseDescription = (id) => {
    const caseItem = cases?.find((c) => c.case_ID === id);
    return caseItem ? `${caseItem.description_}` : id;
  };

  const filteredHearings = courtHearings.filter((h) =>
    Object.values(h).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedHearings = [...filteredHearings].sort((a, b) => {
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
  const currentHearings = sortedHearings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedHearings.length / itemsPerPage);
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
          <h4 className="m-0 text-primary fw-bold">Court Hearings</h4>
          {hasPermission("court_hearings.create") && (
            <button className="btn btn-primary" onClick={goToCreate}>
              + Add Court Hearing
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
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
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
                    { field: "court_hearingID", label: "Hearing ID" },
                    { field: "date_", label: "Date" },
                    { field: "court_name", label: "Court Name" },
                    { field: "verdict", label: "Verdict" },
                    { field: "judge_ID", label: "Judge" },
                    { field: "case_ID", label: "Case Description" },
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
                  {(hasPermission("court_hearings.edit") || hasPermission("court_hearings.delete")) && (
                    <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentHearings.length > 0 ? (
                  currentHearings.map((h) => (
                    <tr key={h.court_hearingID}>
                      <td>{h.court_hearingID}</td>
                      <td>{new Date(h.date_).toLocaleDateString()}</td>
                      <td>{h.court_name}</td>
                      <td>{h.verdict}</td>
                      <td>{getJudgeName(h.judge_ID)}</td>
                      <td>{getCaseDescription(h.case_ID)}</td>
                      {(hasPermission("court_hearings.edit") || hasPermission("court_hearings.delete")) && (
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {hasPermission("court_hearings.edit") && (
                              <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(h)}>
                                Edit
                              </button>
                            )}
                            {hasPermission("court_hearings.delete") && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setDeleteId(h.court_hearingID);
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
                    <td colSpan="7" className="text-center text-muted py-3">
                      No court hearings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedHearings.length)} of {sortedHearings.length} entries
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
      </div>

      {showConfirm && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmDeleteTitle"
            style={{ zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="confirmDeleteTitle">
                    Confirm Delete
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">Are you sure you want to delete this court hearing?</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
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

export default CourtHearingList;
