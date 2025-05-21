import React from "react";

const BlocksList = ({ blocks, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold text-primary">Blocks List</h4>
          <button className="btn btn-success" onClick={goToCreate}>
            + Create New Block
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr key={block.block_id}>
                    <td>{block.block_id}</td>
                    <td>{block.block_name}</td>
                    <td>{block.category}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(block)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(block.block_id)}>
                        Delete
                      </button>
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

export default BlocksList;
