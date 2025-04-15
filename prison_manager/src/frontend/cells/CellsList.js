import React from "react";

const CellsList = ({ cells, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Cell Blocks List</h2>
        <button className="btn btn-success" onClick={goToCreate}>+ Create New Cell Block</button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Block Name</th>
            <th>Capacity</th>
            <th>Actual Capacity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cells.map((cell) => (
            <tr key={cell.cell_block_ID}>
              <td>{cell.cell_block_ID}</td>
              <td>{cell.block_name}</td>
              <td>{cell.capacity}</td>
              <td>{cell.actual_capacity}</td>
              <td>{cell.category}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(cell)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(cell.cell_block_ID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CellsList;
