import React, { useState } from "react";

const JudgesList = ({ judges, onEdit, onDelete, goToCreate }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("judge_ID");
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

  const filteredJudges = [...judges]
    .filter((judge) =>
      [judge.judge_ID, judge.first_name, judge.last_name, judge.email, judge.rank_]
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
  const currentJudges = filteredJudges.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredJudges.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#4E73DF" }}>
          <h4 className="m-0 text-primary fw-bold">Judges List</h4>
          {hasPermission("judges.create") && (
            <button className="btn btn-primary" onClick={goToCreate}>+ Add Judge</button>
          )}
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
                    { field: "judge_ID", label: "ID" },
                    { field: "first_name", label: "First Name" },
                    { field: "last_name", label: "Last Name" },
                    { field: "date_of_birth", label: "Birth Date" },
                    { field: "email", label: "Email" },
                    { field: "rank_", label: "Rank" },
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                    >
                      {label} {renderSortIcons(field)}
                    </th>
                  ))}
                  {(hasPermission("judges.edit") || hasPermission("judges.delete")) && (
                    <th style={{ backgroundColor: "#4E73DF", color: "white" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentJudges.length > 0 ? (
                  currentJudges.map((judge) => (
                    <tr key={judge.judge_ID}>
                      <td>{judge.judge_ID}</td>
                      <td>{judge.first_name}</td>
                      <td>{judge.last_name}</td>
                      <td>{judge.date_of_birth}</td>
                      <td>{judge.email}</td>
                      <td>{judge.rank_}</td>
                      {(hasPermission("judges.edit") || hasPermission("judges.delete")) && (
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {hasPermission("judges.edit") && (
                              <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(judge)}>Edit</button>
                            )}
                            {hasPermission("judges.delete") && (
                              <button className="btn btn-sm btn-outline-danger" onClick={() => { setDeleteId(judge.judge_ID); setShowConfirm(true); }}>Delete</button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="text-center text-muted py-3">No judges found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredJudges.length)} of {filteredJudges.length} entries
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
                  <p>Are you sure you want to delete this judge?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                  <button className="btn btn-danger" onClick={() => { onDelete(deleteId); setShowConfirm(false); }}>Yes, delete</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JudgesList;
