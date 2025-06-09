import React, { useState } from "react";

const PrisonerAccountsList = ({ accounts, onEdit, onDelete, goToCreate }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("account_ID");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = [...accounts]
    .filter((acc) =>
      Object.values(acc).some((v) =>
        String(v).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAccounts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderSortIcons = (field) => {
    const active = sortField === field;
    const color = active ? "white" : "#343a40";
    return (
      <span
        className="ms-1 d-inline-flex flex-column"
        style={{ fontSize: "0.7rem", lineHeight: "0.7rem", transform: "translateY(-7px)" }}
      >
        <span style={{ color, opacity: active && sortDirection === "asc" ? 1 : 0.3 }}>▲</span>
        <span style={{ color, opacity: active && sortDirection === "desc" ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div
        className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom"
        style={{ backgroundColor: "#4E73DF" }}
      >
        <h4 className="m-0 text-primary fw-bold">Prisoner Accounts</h4>
        {hasPermission("prisoner_accounts.create") && (
          <button className="btn btn-primary" onClick={goToCreate}>
            + Add Account
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ maxWidth: "300px" }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                {[
                  { field: "account_ID", label: "ID" },
                  { field: "prisoner_ID", label: "Prisoner ID" },
                  { field: "balance", label: "Balance" },
                  { field: "status", label: "Status" },
                ].map(({ field, label }) => (
                  <th
                    key={field}
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => {
                      if (sortField === field) {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                      } else {
                        setSortField(field);
                        setSortDirection("asc");
                      }
                    }}
                  >
                    {label} {renderSortIcons(field)}
                  </th>
                ))}
                {(hasPermission("prisoner_accounts.edit") || hasPermission("prisoner_accounts.delete")) && (
                  <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentAccounts.length > 0 ? (
                currentAccounts.map((acc) => (
                  <tr key={acc.account_ID}>
                    <td>{acc.account_ID}</td>
                    <td>{acc.prisoner_ID}</td>
                    <td>{acc.balance}</td>
                    <td>{acc.status}</td>
                    {(hasPermission("prisoner_accounts.edit") || hasPermission("prisoner_accounts.delete")) && (
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {hasPermission("prisoner_accounts.edit") && (
                            <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(acc)}>
                              Edit
                            </button>
                          )}
                          {hasPermission("prisoner_accounts.delete") && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setDeleteId(acc.account_ID);
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
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <div className="small text-muted mb-2 mb-md-0">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
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
                  <p>Are you sure you want to delete this account?</p>
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

export default PrisonerAccountsList;
