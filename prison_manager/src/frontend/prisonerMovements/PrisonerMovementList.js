import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";

const PrisonerMovementsList = ({ movements, onEdit, onDelete, goToCreate }) => {

  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());


  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("prisoner_movement_ID");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const [prisoners, setPrisoners] = useState([]);
  const [cells, setCells] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prisonersRes, cellsRes] = await Promise.all([
          axiosInstance.get("/prisoners"),
          axiosInstance.get("/cells"),
        ]);
        setPrisoners(prisonersRes.data);
        setCells(cellsRes.data);
      } catch (err) {
        console.error("Error loading prisoners or cells:", err);
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
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };


  const getPrisonerName = (id) => {
    const prisoner = prisoners.find((p) => p.prisonerID === id);
    return prisoner ? `${prisoner.first_name} ${prisoner.last_name}` : "Unknown";
  };

  const getCellName = (id) => {
    const cell = cells.find((c) => c.cell_block_ID === id);
    return cell ? `Block: ${cell.block_name} - Cell: ${cell.cell_number}` : "No cell assigned";
  };
  


  const filteredMovements = movements
  .filter((mv) => {
    const prisonerName = getPrisonerName(mv.prisonerID);
    const fromCellName = getCellName(mv.from_cell_ID);
    const toCellName = getCellName(mv.to_cell_ID);
    const dateStr = mv.date_ ? mv.date_.toString().split("T")[0] : "";

    const searchFields = [
      mv.prisoner_movement_ID?.toString() || "",
      prisonerName,
      fromCellName,
      toCellName,
      dateStr,
    ];

    return searchFields.some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    );
  })
  .sort((a, b) => {
    let aVal, bVal;

    if (sortField === "prisonerID") {
      aVal = getPrisonerName(a.prisonerID);
      bVal = getPrisonerName(b.prisonerID);
    } else if (sortField === "from_cell_ID") {
      aVal = getCellName(a.from_cell_ID);
      bVal = getCellName(b.from_cell_ID);
    } else if (sortField === "to_cell_ID") {
      aVal = getCellName(a.to_cell_ID);
      bVal = getCellName(b.to_cell_ID);
    } else if (sortField === "date_") {
      aVal = a.date_;
      bVal = b.date_;
    } else {
      aVal = a[sortField];
      bVal = b[sortField];
    }

    if (aVal === undefined || aVal === null) aVal = "";
    if (bVal === undefined || bVal === null) bVal = "";

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });


  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMovements = filteredMovements.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
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
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
        <h4 className="m-0 text-primary fw-bold">Prisoner Movements</h4>
        {hasPermission("prisoner_movements.create") && (
          <button className="btn btn-primary" onClick={goToCreate}>
            + Add Movement
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
                  { label: "ID", field: "prisoner_movement_ID" },
                  { label: "Prisoner", field: "prisonerID" },
                  { label: "From Cell", field: "from_cell_ID" },
                  { label: "To Cell", field: "to_cell_ID" },
                  { label: "Date", field: "date_" },
                ].map(({ label, field }) => (
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
                {(hasPermission("prisoner_movements.edit") ||
                  hasPermission("prisoner_movements.delete")) && (
                  <th style={{ color: "white", backgroundColor: "#4E73DF" }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentMovements.length > 0 ? (
                currentMovements.map((mv) => (
                  <tr key={mv.prisoner_movement_ID}>
                    <td>{mv.prisoner_movement_ID}</td>
                    <td>{getPrisonerName(mv.prisonerID)}</td>
                    <td>{getCellName(mv.from_cell_ID)}</td>
                    <td>{getCellName(mv.to_cell_ID)}</td>
                    <td>{mv.date_?.split("T")[0] || mv.date_}</td>
                    {(hasPermission("prisoner_movements.edit") ||
                      hasPermission("prisoner_movements.delete")) && (
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {hasPermission("prisoner_movements.edit") && (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => onEdit(mv)}
                            >
                              Edit
                            </button>
                          )}
                          {hasPermission("prisoner_movements.delete") && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setDeleteId(mv.prisoner_movement_ID);
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
                  <td colSpan="100%" className="text-center">
                    No prisoner movements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <div className="small text-muted mb-2 mb-md-0">
            Showing {indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filteredMovements.length)} of {filteredMovements.length}{" "}
            entries
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

        {showConfirm && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
            tabIndex="-1"
            role="dialog"
            onClick={() => setShowConfirm(false)}
          >
            <div
              className="modal-dialog"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirm(false)}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete movement ID {deleteId}?</p>
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
                    Yes, I'm sure
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

export default PrisonerMovementsList;
