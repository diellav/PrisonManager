import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const PrisonerMovementsForm = ({
  form = {},
  isEditing,
  handleInputChange,
  handleSubmit,
  handleClose,
}) => {
  const [prisoners, setPrisoners] = useState([]);
  const [cells, setCells] = useState([]);
  const [error, setError] = useState("");
  const [currentCell, setCurrentCell] = useState(null);

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
        setError("Failed to load prisoners or cells.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (form.prisonerID) {
      const prisoner = prisoners.find(
        (p) => p.prisonerID === parseInt(form.prisonerID, 10)
      );
      if (prisoner) {
        const cell = cells.find((c) => c.cell_block_ID === prisoner.cell_block_ID);
        setCurrentCell(cell || null);

        if (cell && form.from_cell_ID !== cell.cell_block_ID) {
          handleInputChange({
            target: { name: "from_cell_ID", value: cell.cell_block_ID },
          });
        }
      } else {
        setCurrentCell(null);
        handleInputChange({
          target: { name: "from_cell_ID", value: "" },
        });
      }
    } else {
      setCurrentCell(null);
      handleInputChange({
        target: { name: "from_cell_ID", value: "" },
      });
    }
  }, [form.prisonerID, prisoners, cells]);

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {isEditing ? "Edit Movement" : "Create Movement"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="row">

            <div className="col-md-6 mb-3">
              <label>Prisoner</label>
              <select
                className="form-control"
                name="prisonerID"
                value={form.prisonerID || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Prisoner</option>
                {prisoners.map((p) => (
                  <option key={p.prisonerID} value={p.prisonerID}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>


            <div className="col-md-6 mb-3">
              <label>Current Cell (From)</label>
              <input
                type="text"
                className="form-control"
                value={
                  currentCell
                    ? `Block: ${currentCell.block_name} - Cell: ${currentCell.cell_number}`
                    : "No cell assigned"
                }
                disabled
              />
              <input
                type="hidden"
                name="from_cell_ID"
                value={form.from_cell_ID || ""}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                name="date_"
                value={form.date_ || ""}
                onChange={handleInputChange}
                required
              />
            </div>


            <div className="col-md-6 mb-3">
              <label>Destination Cell (To)</label>
              <select
                className="form-control"
                name="to_cell_ID"
                value={form.to_cell_ID || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Destination Cell</option>
                {cells.map((cell) => (
                  <option key={cell.cell_block_ID} value={cell.cell_block_ID}>
                    Block: {cell.block_name} - Cell: {cell.cell_number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrisonerMovementsForm;
