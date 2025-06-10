import React, { useState } from "react";

const TransactionList = ({
  transactions,
  prisonPurchases = [],
  prisonerAccounts = [],
  prisoners = [],      
  onEdit,
  onDelete,
  goToCreate,
}) => {

  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("transaction_ID");
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

  const filteredTransactions = transactions.filter((tx) => {
    const purchase = prisonPurchases.find((p) => p.prison_purchase_ID === tx.reference_of_purchase);
    const account = prisonerAccounts.find((a) => a.prisoner_account_ID === (purchase?.prisoner_account_ID ?? -1));
    const prisoner = prisoners.find((pr) => pr.prisonerID === tx.prisonerID);

    const searchStr =
      String(tx.transaction_ID) +
      " " +
      String(tx.prisonerID) +
      " " +
      (prisoner ? prisoner.first_name + " " + (prisoner.last_name || "") : "") +  // Kërkon emrin e të burgosurit
      " " +
      (purchase ? String(purchase.prison_purchase_ID) : "") +
      " " +
      (account ? String(account.prisoner_account_ID) : "") +
      " " +
      tx.amount +
      " " +
      tx.type_ +
      " " +
      tx.date_;

    return searchStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sortimi i filtruar
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "reference_of_purchase":
        aValue = a.reference_of_purchase;
        bValue = b.reference_of_purchase;
        break;
      case "prisoner_account_ID":
        const aPurchase = prisonPurchases.find((p) => p.prison_purchase_ID === a.reference_of_purchase);
        const bPurchase = prisonPurchases.find((p) => p.prison_purchase_ID === b.reference_of_purchase);
        aValue = aPurchase ? aPurchase.prisoner_account_ID : 0;
        bValue = bPurchase ? bPurchase.prisoner_account_ID : 0;
        break;
      case "prisonerName":
        // Merr emrin e të burgosurit për a dhe b
        const aPrisoner = prisoners.find((pr) => pr.prisonerID === a.prisonerID);
        const bPrisoner = prisoners.find((pr) => pr.prisonerID === b.prisonerID);
        aValue = aPrisoner ? aPrisoner.first_name : "";
        bValue = bPrisoner ? bPrisoner.first_name : "";
        break;
      default:
        aValue = a[sortField];
        bValue = b[sortField];
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderSortIcons = (field) => {
    const active = sortField === field;
    const activeAsc = active && sortDirection === "asc";
    const activeDesc = active && sortDirection === "desc";
    const color = active ? "white" : "#343a40";

    return (
      <span
        className="ms-1 d-inline-flex flex-column"
        style={{ fontSize: "0.7rem", lineHeight: "0.7rem", transform: "translateY(-7px)" }}
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
          <h4 className="m-0 text-primary fw-bold">Transactions</h4>
          {hasPermission("transactions.create") && (
            <button className="btn btn-primary" onClick={goToCreate}>
              + Add Transaction
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
                  <th
                    className="sortable"
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => handleSort("transaction_ID")}
                  >
                    ID {renderSortIcons("transaction_ID")}
                  </th>
                  <th
                    className="sortable"
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => handleSort("prisonerName")}  
                  >
                    Prisoner Name {renderSortIcons("prisonerName")}
                  </th>
                  <th
                    className="sortable"
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => handleSort("reference_of_purchase")}
                  >
                    Reference Purchase ID {renderSortIcons("reference_of_purchase")}
                  </th>
                  <th
                    className="sortable"
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => handleSort("amount")}
                  >
                    Amount {renderSortIcons("amount")}
                  </th>
                  <th
                    className="sortable"
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => handleSort("type_")}
                  >
                    Type {renderSortIcons("type_")}
                  </th>
                  <th
                    className="sortable"
                    style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                    onClick={() => handleSort("date_")}
                  >
                    Date {renderSortIcons("date_")}
                  </th>
                  {(hasPermission("transactions.edit") || hasPermission("transactions.delete")) && (
                    <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((tx) => {
                    const prisoner = prisoners.find((pr) => pr.prisonerID === tx.prisonerID);
                    return (
                      <tr key={tx.transaction_ID}>
                        <td>{tx.transaction_ID}</td>
                        <td>{prisoner ? `${prisoner.first_name} ${prisoner.last_name || ""}` : tx.prisonerID}</td>
                        <td>{tx.reference_of_purchase}</td>
                        <td>{Number(tx.amount).toFixed(2)}</td>
                        <td>{tx.type_}</td>
                        <td>{tx.date_?.slice(0, 10)}</td>
                        {(hasPermission("transactions.edit") || hasPermission("transactions.delete")) && (
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {hasPermission("transactions.edit") && (
                                <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(tx)}>
                                  Edit
                                </button>
                              )}
                              {hasPermission("transactions.delete") && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    setDeleteId(tx.transaction_ID);
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
                    <td colSpan={7} className="text-center text-muted">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
              </li>
              {pageNumbers.map((num) => (
                <li key={num} className={`page-item ${num === currentPage ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(num)}>
                    {num}
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
          </nav>
        </div>
      </div>

      {showConfirm && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this transaction?</p>
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

export default TransactionList;
