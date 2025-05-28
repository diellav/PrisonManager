import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";

const PrisonersList = ({ prisoners, onEdit, onDelete, goToCreate }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("prisonerID");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [cells, setCells] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingDataError, setLoadingDataError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cellsRes, contactsRes] = await Promise.all([
          axiosInstance.get("/cells"),
          axiosInstance.get("/emergency_contacts")
        ]);
        setCells(cellsRes.data);
        setContacts(contactsRes.data);
      } catch (err) {
        console.error("Error fetching cells or contacts:", err);
        setLoadingDataError("Failed to load cell blocks or emergency contacts.");
      }
    };
    fetchData();
  }, []);

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
      <span
        className="ms-1 d-inline-flex flex-column"
        style={{ fontSize: "0.7rem", lineHeight: "0.7rem", transform: "translateY(-7px)" }}
      >
        <span style={{ color, opacity: activeAsc ? 1 : 0.3 }}>▲</span>
        <span style={{ color, opacity: activeDesc ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  const filteredPrisoners = [...prisoners]
    .filter((prisoner) =>
      [
        prisoner.prisonerID,
        prisoner.first_name,
        prisoner.last_name,
        prisoner.date_of_birth?.split("T")[0],
        prisoner.gender,
        prisoner.national_id,
        prisoner.address_,
        prisoner.status_,
        prisoner.rank_,
        prisoner.cell_block_ID,
        prisoner.emergency_contact_ID,
      ].some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
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
  const currentPrisoners = filteredPrisoners.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPrisoners.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div
         className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom"
         style={{ backgroundColor: "#4E73DF" }}
      >
        <h4 className="m-0 text-primary fw-bold">Prisoners List</h4>
        {hasPermission("prisoners.create") && (
          <button className="btn btn-primary" onClick={goToCreate}>
            + Add Prisoner
          </button>
        )}
      </div>

      <div className="card-body">
        {loadingDataError && (
          <div className="alert alert-danger">{loadingDataError}</div>
        )}

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
                  { label: "ID", field: "prisonerID" },
                  { label: "First Name", field: "first_name" },
                  { label: "Last Name", field: "last_name" },
                  { label: "DOB", field: "date_of_birth" },
                  { label: "Gender", field: "gender" },
                  { label: "National ID", field: "national_id" },
                  { label: "Address", field: "address_" },
                  { label: "Photo", field: "photo" },
                  { label: "Sentence Start", field: "sentence_start" },
                  { label: "Sentence End", field: "sentence_end" },
                  { label: "Status", field: "status_" },
                  { label: "Rank", field: "rank_" },
                  { label: "Block & Cell", field: "cell_block_ID" },
                  { label: "Emergency Contact", field: "emergency_contact_ID" },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                    onClick={() => handleSort(field)}
                  >
                    {label} {renderSortIcons(field)}
                  </th>
                ))}
                {(hasPermission("prisoners.edit") || hasPermission("prisoners.delete")) && (
                  <th style={{ backgroundColor: "#4E73DF", color: "white" }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentPrisoners.length > 0 ? (
                currentPrisoners.map((p) => {
                  const cell = cells.find(cell => cell.cell_block_ID === p.cell_block_ID);
                  const contact = contacts.find(contact => contact.emergency_contact_ID === p.emergency_contact_ID);

                  return (
                    <tr key={p.prisonerID}>
                      <td>{p.prisonerID}</td>
                      <td>{p.first_name}</td>
                      <td>{p.last_name}</td>
                      <td>{p.date_of_birth?.split("T")[0]}</td>
                      <td>{p.gender}</td>
                      <td>{p.national_id}</td>
                      <td>{p.address_}</td>
                      <td>
                        {p.photo ? (
                          <img
                            src={p.photo}
                            alt={`${p.first_name} ${p.last_name}`}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{p.sentence_start?.split("T")[0]}</td>
                      <td>{p.sentence_end?.split("T")[0]}</td>
                      <td>{p.status_}</td>
                      <td>{p.rank_}</td>
                      <td>{cell ? `Block: ${cell.block_name} Cell: ${cell.cell_number}` : "None"}</td>
                      <td>{contact ? `${contact.first_name} ${contact.last_name}` : "None"}</td>
                      {(hasPermission("prisoners.edit") || hasPermission("prisoners.delete")) && (
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {hasPermission("prisoners.edit") && (
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => onEdit(p)}
                              >
                                Edit
                              </button>
                            )}
                            {hasPermission("prisoners.delete") && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setDeleteId(p.prisonerID);
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
                  <td colSpan="100%" className="text-center">
                    No prisoners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Showing {indexOfFirst + 1} to{" "}
            {indexOfLast > filteredPrisoners.length
              ? filteredPrisoners.length
              : indexOfLast}{" "}
            of {filteredPrisoners.length} entries
          </div>

          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
              </li>
              {pageNumbers.map((num) => (
                <li
                  key={num}
                  className={`page-item ${num === currentPage ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(num)}>
                    {num}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages || totalPages === 0 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>

        
        {showConfirm && (
          <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirm(false)}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete prisoner ID {deleteId}?</p>
                </div>
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
        )}
      </div>
    </div>
  );
};

export default PrisonersList;
