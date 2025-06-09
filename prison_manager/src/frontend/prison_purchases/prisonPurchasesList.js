import React, { useState } from "react";

const PrisonPurchasesList = ({
  prisonPurchases = [],
  prisoners = [],
  guards = [],
  storeItems = [],
   prisonerAccounts = [],
  onEdit,
  onDelete,
  goToCreate,
}) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("prison_purchase_ID");
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

const getPrisonerName = (prisoner_account_ID) => {
    const prisonerAccount = prisonerAccounts.find(acc => acc.prisoner_account_ID === prisoner_account_ID);
    if (!prisonerAccount) return prisoner_account_ID;

    const prisoner = prisoners.find(p => p.prisonerID === prisonerAccount.prisonerID);
    if (!prisoner) return prisoner_account_ID;

    return `${prisoner.first_name} ${prisoner.last_name}`;
  };
  const getGuardName = (approved_by) => {
    const guard = guards.find(g => g.guard_staff_ID === approved_by);
    return guard ? `${guard.first_name} ${guard.last_name || ''}`.trim() : approved_by;
  };

  const getStoreItemName = (id) => {
    const item = storeItems.find(i => i.store_item_ID === id);
    return item ? item.name_ : id;
  };

  const filteredPurchases = prisonPurchases.filter((purchase) => {
    const search = searchTerm.toLowerCase();
    return (
      String(purchase.prison_purchase_ID).includes(search) ||
      getStoreItemName(purchase.store_item_ID).toLowerCase().includes(search) ||
      String(purchase.quantity).toLowerCase().includes(search) ||
      String(purchase.total_price).toLowerCase().includes(search) ||
      (purchase.date_ && purchase.date_.toLowerCase().includes(search)) ||
      getPrisonerName(purchase.prisoner_account_ID).toLowerCase().includes(search) ||
      getGuardName(purchase.approved_by).toLowerCase().includes(search)
    );
  });

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "prisoner_account_ID") {
      aVal = getPrisonerName(a.prisoner_account_ID).toLowerCase();
      bVal = getPrisonerName(b.prisoner_account_ID).toLowerCase();
    } else if (sortField === "approved_by") {
      aVal = getGuardName(a.approved_by).toLowerCase();
      bVal = getGuardName(b.approved_by).toLowerCase();
    } else if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPurchases = sortedPurchases.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage);
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
    <div>
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom" style={{ backgroundColor: "#4E73DF" }}>
          <h4 className="m-0 text-primary fw-bold">Prison Purchases List</h4>
          {hasPermission("prison_purchases.create") && <button className="btn btn-primary" onClick={goToCreate}>+ Add Purchase</button>}
        </div>
        <div className="card-body">
          <div className="row mb-3 align-items-center">
            <div className="col-md-6 d-flex align-items-center">
              <label className="d-flex align-items-center" style={{ gap: "10px" }}>
                Show
                <select className="form-select form-select-sm" style={{ width: "80px" }} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                entries
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-md-end justify-content-start mt-2 mt-md-0">
              <input type="text" className="form-control form-control-sm" placeholder="Search..." value={searchTerm} onChange={handleSearch} style={{ maxWidth: "300px" }} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  {[
                    { field: "prison_purchase_ID", label: "ID" },
                    { field: "store_item_ID", label: "Store Item" },
                    { field: "quantity", label: "Quantity" },
                    { field: "total_price", label: "Total Price" },
                    { field: "date_", label: "Date" },
                    { field: "prisoner_account_ID", label: "Prisoner" },
                    { field: "approved_by", label: "Approved By" },
                  ].map(({ field, label }) => (
                    <th key={field} onClick={() => handleSort(field)} style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}>
                      {label} {renderSortIcons(field)}
                    </th>
                  ))}
                  {(hasPermission("prison_purchases.edit") || hasPermission("prison_purchases.delete")) && (
                    <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentPurchases.length > 0 ? currentPurchases.map(purchase => (
                  <tr key={purchase.prison_purchase_ID}>
                    <td>{purchase.prison_purchase_ID}</td>
                    <td>{getStoreItemName(purchase.store_item_ID)}</td>
                    <td>{purchase.quantity}</td>
                    <td>{purchase.total_price?.toFixed(2)}</td>
                    <td>{purchase.date_?.split('T')[0]}</td>
                    <td>{getPrisonerName(purchase.prisoner_account_ID)}</td>
                    <td>{getGuardName(purchase.approved_by)}</td>
                    {(hasPermission("prison_purchases.edit") || hasPermission("prison_purchases.delete")) && (
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {hasPermission("prison_purchases.edit") && (
                            <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(purchase)}>Edit</button>
                          )}
                          {hasPermission("prison_purchases.delete") && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => {
                              setDeleteId(purchase.prison_purchase_ID);
                              setShowConfirm(true);
                            }}>Delete</button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-3">No prison purchases found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedPurchases.length)} of {sortedPurchases.length} entries
            </div>
            <ul className="pagination mb-0 mt-2 mt-md-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>Prev</button>
              </li>
              {pageNumbers.map(number => (
                <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(number)}>{number}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>Next</button>
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
                  <p>Are you sure you want to delete this prison purchase?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                  <button className="btn btn-danger" onClick={() => { onDelete(deleteId); setShowConfirm(false); }}>Yes, I'm sure</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrisonPurchasesList;