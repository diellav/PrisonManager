import React from "react";

const CellsList = ({ cells, blocks, onEdit, onDelete, goToCreate }) => {
  const getBlockName = (blockId) => {
    const block = blocks.find(block => block.block_id === blockId);
    return block ? block.block_name : "Unknown";
  };

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold text-primary">Cells List</h4>
          <button className="btn btn-success" onClick={goToCreate}>
            + Create New Cell
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Block Name</th>
                  <th>Cell Number</th>
                  <th>Capacity</th>
                  <th>Actual Capacity</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cells.map((cell) => (
                  <tr key={cell.cell_block_ID}>
                    <td>{cell.cell_block_ID}</td><td>{getBlockName(cell.block_id)}</td><td>{cell.cell_number}</td><td>{cell.capacity}</td><td>{cell.actual_capacity}</td><td>{cell.category}</td><td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(cell)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(cell.cell_block_ID)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CellsList;
