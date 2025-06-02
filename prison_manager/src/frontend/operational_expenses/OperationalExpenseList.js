import React, { useState } from "react";

const OperationalExpensesList = ({
  expenses,
  onEdit,
  onDelete,
  goToCreate,
  budgets = [],
  assets = [],
  users = [],
}) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("operational_expense_ID");
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

  const sortedExpenses = [...expenses]
    .filter((expense) =>
      Object.values(expense).some((value) =>
        String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase())
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
  const currentExpenses = sortedExpenses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
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
          <h4 className="m-0 text-primary fw-bold">Operational Expenses</h4>
          {hasPermission("operational_expenses.create") && (
            <button className="btn btn-primary" onClick={goToCreate}>
              + Add Expense
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
                    { field: "operational_expense_ID", label: "ID" },
                    { field: "description_", label: "Description" },
                    { field: "amount", label: "Amount" },
                    { field: "date_", label: "Date" },
                    { field: "category", label: "Category" },
                    { field: "budget_ID", label: "Budget" },
                    { field: "approved_by", label: "Approved By" },
                    { field: "asset_ID", label: "Asset" },
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      className="sortable"
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort(field)}
                    >
                      {label} {renderSortIcons(field)}
                    </th>
                  ))}
                  {(hasPermission("operational_expenses.edit") ||
                    hasPermission("operational_expenses.delete")) && (
                    <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
  {currentExpenses.length > 0 ? (
    currentExpenses.map((expense) => {
      const budget = budgets.find((b) => parseInt(b.budget_ID) === parseInt(expense.budget_ID));
      const user = users.find((u) => u.userID === expense.approved_by);
      const asset = assets.find((a) => a.asset_ID === expense.asset_ID);

      return (
        <tr key={expense.operational_expense_ID}>
          <td>{expense.operational_expense_ID}</td>
          <td>{expense.description_}</td>
          <td>{Number(expense.amount).toFixed(2)}</td>
          <td>{expense.date_?.slice(0, 10)}</td>
          <td>{expense.category}</td>
          <td>
            {budget
              ? `${budget.year_} - ${budget.description_}`
              : expense.budget_ID}
          </td>
          <td>
            {user ? `${user.first_name} ${user.last_name}` : expense.approved_by}
          </td>
          <td>{asset ? asset.name : expense.asset_ID ?? "-"}</td>
          {(hasPermission("operational_expenses.edit") ||
            hasPermission("operational_expenses.delete")) && (
            <td>
              <div style={{ display: "flex", gap: "6px" }}>
                {hasPermission("operational_expenses.edit") && (
                  <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => onEdit(expense)}
                  >
                    Edit
                  </button>
                )}
                {hasPermission("operational_expenses.delete") && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setDeleteId(expense.operational_expense_ID);
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
      <td colSpan="9" className="text-center text-muted py-3">
        No operational expenses found.
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedExpenses.length)} of{" "}
              {sortedExpenses.length} entries
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
                  <p>Are you sure you want to delete this operational expense?</p>
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

export default OperationalExpensesList;
