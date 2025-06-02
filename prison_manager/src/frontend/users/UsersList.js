  import React, { useState } from "react";


  const UsersList = ({ users, onEdit, onDelete, goToCreate, getRoleName }) => {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("userID");
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
        <span
          className="ms-1 d-inline-flex flex-column"
          style={{ fontSize: "0.7rem", lineHeight: "0.7rem", transform: "translateY(-7px)" }}
        >
          <span style={{ color, opacity: activeAsc ? 1 : 0.3 }}>▲</span>
          <span style={{ color, opacity: activeDesc ? 1 : 0.3 }}>▼</span>
        </span>
      );
    };


    const filteredUsers = [...users]
      .filter((user) => {
        const dob = user.date_of_birth ? user.date_of_birth.split("T")[0] : "";
        const roleName = getRoleName(user.roleID) || "";
        return [
          user.userID,
          user.first_name,
          user.last_name,
          dob,
          user.gender,
          user.phone,
          user.address_,
          user.email,
          user.username,
          roleName,
          user.employment_date
        ].some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
      })
      .sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];


        if (sortField === "date_of_birth") {
          aVal = aVal ? aVal.split("T")[0] : "";
          bVal = bVal ? bVal.split("T")[0] : "";
        }


        if (sortField === "roleName") {
          aVal = getRoleName(a.roleID) || "";
          bVal = getRoleName(b.roleID) || "";
        }

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div>
        <div className="card shadow-sm mb-4 border-0">
          <div
            className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom"
            style={{ backgroundColor: "#4E73DF" }}
          >
            <h4 className="m-0 text-primary fw-bold">Users List</h4>
            {hasPermission("users.create") && (
              <button className="btn btn-primary" onClick={goToCreate}>
                + Add User
              </button>
            )}
          </div>

          <div className="card-body">
            <div className="row mb-3 align-items-center">
              <div className="col-md-6 d-flex align-items-center">
                <label
                  className="d-flex align-items-center"
                  style={{ gap: "10px" }}
                >
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
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("userID")}
                    >
                      ID {renderSortIcons("userID")}
                    </th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("first_name")}
                    >
                      First Name {renderSortIcons("first_name")}
                    </th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("last_name")}
                    >
                      Last Name {renderSortIcons("last_name")}
                    </th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("date_of_birth")}
                    >
                      Date of Birth {renderSortIcons("date_of_birth")}
                    </th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("gender")}
                    >
                      Gender {renderSortIcons("gender")}
                    </th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("phone")}
                    >
                      Phone {renderSortIcons("phone")}
                    </th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("address_")}
                    >
                      Address {renderSortIcons("address_")}
                    </th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("email")}
                    >
                      Email {renderSortIcons("email")}
                    </th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("username")}
                    >
                      Username {renderSortIcons("username")}
                    </th>
                    <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Photo</th>
                    <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("roleName")}
                    >
                      Role {renderSortIcons("roleName")}
                    </th>
                     <th
                      style={{ cursor: "pointer", color: "white", backgroundColor: "#4E73DF" }}
                      onClick={() => handleSort("employment_date")}
                    >
                      Employment Date {renderSortIcons("employment_date")}
                    </th>
                    {(hasPermission("users.edit") || hasPermission("users.delete")) && (
                      <th style={{ color: "white", backgroundColor: "#4E73DF" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.userID}>
                        <td>{user.userID}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.date_of_birth?.split("T")[0]}</td>
                        <td>{user.gender}</td>
                        <td>{user.phone}</td>
                        <td>{user.address_}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>
                          {user.photo ? (
                            <img
                              src={`http://localhost:5000/uploads/${user.photo}`}
                              alt="User"
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                            />
                          ) : (
                            <img
                              src="/default-avatar.png"
                              alt="Default Avatar"
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                            />
                          )}
                        </td>
                        <td>{getRoleName(user.roleID)}</td>
                        <td>{user.employment_date?.split("T")[0]}</td>
                        {(hasPermission("users.edit") || hasPermission("users.delete")) && getRoleName(user.roleID) !== "SuperAdmin" && (
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {hasPermission("users.edit") && (
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => onEdit(user)}
                                >
                                  Edit
                                </button>
                              )}
                              {hasPermission("users.delete") && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    setDeleteId(user.userID);
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
                      <td colSpan={12} className="text-center text-muted py-3">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
              <div className="small text-muted mb-2 mb-md-0">
                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredUsers.length)} of{" "}
                {filteredUsers.length} entries
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
                    <p>Are you sure you want to delete this user?</p>
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

  export default UsersList;
