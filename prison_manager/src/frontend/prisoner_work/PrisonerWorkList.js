import React, { useState } from "react";

const PrisonerWorkList = ({
  works,
  onEdit,
  onDelete,
  goToCreate,
  prisoners = [],
}) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("first_name");
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
const sortedWorks = [...works]
  .filter((work) => {
    const prisoner = prisoners.find((p) => p.prisonerID === work.prisonerID);
    const name = prisoner
      ? `${prisoner.first_name} ${prisoner.last_name}`.toLowerCase()
      : "";
    const workValues = Object.values(work)
      .map((v) => String(v ?? "").toLowerCase())
      .join(" ");
    const combined = `${name} ${workValues}`;
    return combined.includes(searchTerm.toLowerCase());
  })
  .sort((a, b) => {
    if (sortField === "first_name") {
      const prisonerA = prisoners.find((p) => p.prisonerID === a.prisonerID);
      const prisonerB = prisoners.find((p) => p.prisonerID === b.prisonerID);
      const nameA = prisonerA ? prisonerA.first_name.toLowerCase() : "";
      const nameB = prisonerB ? prisonerB.first_name.toLowerCase() : "";

      if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
      if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    } else {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentWorks = sortedWorks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedWorks.length / itemsPerPage);
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
    <div>
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h4 className="m-0 text-primary fw-bold">Prisoner Work</h4>
          {hasPermission("prisoner_work.create") && (
            <button className="btn btn-primary" onClick={goToCreate}>
              + Add Work
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
                    { field: "prisoner_work_ID", label: "ID" },
                    { field: "first_name", label: "Prisoner Name" },
                    { field: "work_type", label: "Work Type" },
                    { field: "work_hours", label: "Hours" },
                    { field: "work_status", label: "Status" },
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      className="sortable"
                      style={{
                        cursor: "pointer",
                        color: "white",
                        backgroundColor: "#4E73DF",
                      }}
                      onClick={() => handleSort(field)}
                    >
                      {label} {renderSortIcons(field)}
                    </th>
                  ))}
                  {(hasPermission("prisoner_work.edit") ||
                    hasPermission("prisoner_work.delete")) && (
                    <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentWorks.length > 0 ? (
                  currentWorks.map((work) => {
                    const prisoner = prisoners.find((p) => p.prisonerID === work.prisonerID);
                    return (
                      <tr key={work.prisoner_work_ID}>
                        <td>{work.prisoner_work_ID}</td>
                        <td>
                          {prisoner
                            ? `${prisoner.first_name} ${prisoner.last_name}`
                            : work.prisonerID}
                        </td>
                        <td>{work.work_type}</td>
                        <td>{work.work_hours}</td>
                        <td>{work.work_status}</td>
                        {(hasPermission("prisoner_work.edit") ||
                          hasPermission("prisoner_work.delete")) && (
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {hasPermission("prisoner_work.edit") && (
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => onEdit(work)}
                                >
                                  Edit
                                </button>
                              )}
                              {hasPermission("prisoner_work.delete") && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    setDeleteId(work.prisoner_work_ID);
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-3">
                      No prisoner work found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedWorks.length)} of{" "}
              {sortedWorks.length} entries
            </div>
            <ul className="pagination mb-0 mt-2 mt-md-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Prev
                </button>
              </li>
              {pageNumbers.map((number) => (
                <li
                  key={number}
                  className={`page-item ${currentPage === number ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(number)}>
                    {number}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                >
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
                  <p>Are you sure you want to delete this prisoner work?</p>
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

export default PrisonerWorkList;
