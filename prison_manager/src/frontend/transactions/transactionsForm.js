import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const TransactionsForm = ({ editingTransaction, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    prisonerID: "",
    reference_of_purchase: "",
    amount: "",
    type_: "",
    date_: "",
  });

  const [prisoners, setPrisoners] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrisoners();
    fetchPurchases();
  }, []);

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        prisonerID: editingTransaction.prisonerID || "",
        reference_of_purchase: editingTransaction.reference_of_purchase || "",
        amount: editingTransaction.amount || "",
        type_: editingTransaction.type_ || "",
        date_: editingTransaction.date_?.split("T")[0] || "",
      });
    }
  }, [editingTransaction]);

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Error fetching prisoners:", err);
      setPrisoners([]);
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await axiosInstance.get("/prison_purchases");
      setPurchases(res.data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setPurchases([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.prisonerID || !form.reference_of_purchase || !form.amount || !form.type_ || !form.date_) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      if (editingTransaction) {
        await axiosInstance.put(`/transactions/${editingTransaction.transaction_ID}`, form);
      } else {
        await axiosInstance.post("/transactions", form);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error saving transaction:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to save transaction.");
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingTransaction ? "Edit Transaction" : "Create Transaction"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Prisoner</label>
              <select
                name="prisonerID"
                value={form.prisonerID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Prisoner --</option>
                {prisoners.map((p) => (
                  <option key={p.prisonerID} value={p.prisonerID}>
                    {p.first_name} {p.last_name} (ID: {p.prisonerID})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Reference of Purchase</label>
              <select
                name="reference_of_purchase"
                value={form.reference_of_purchase}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Purchase --</option>
                {purchases.map((purchase) => (
                  <option key={purchase.purchase_ID} value={purchase.purchase_ID}>
                    {purchase.description} (ID: {purchase.purchase_ID})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Type</label>
              <input
                type="text"
                name="type_"
                value={form.type_}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date_"
                value={form.date_}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTransaction ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionsForm;