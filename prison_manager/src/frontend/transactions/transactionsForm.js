import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const TransactionForm = ({ editingTransaction, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    type_: "",
    amount: "",
    date_: "",
    prisonerID: "",
    prison_purchase_ID: "",
  });

  const [error, setError] = useState("");
  const [prisoners, setPrisoners] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prisonersRes, purchasesRes] = await Promise.all([
          axiosInstance.get("/prisoners"),
          axiosInstance.get("/prison_purchases"),
        ]);
        setPrisoners(prisonersRes.data);
        setPurchases(purchasesRes.data);
      } catch (err) {
        console.error("Failed to fetch prisoners or purchases:", err);
        setError("Failed to load prisoners or purchases.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        type_: editingTransaction.type_ || "",
        amount:
          editingTransaction.amount != null
            ? editingTransaction.amount.toString()
            : "",
        date_: editingTransaction.date_ ? editingTransaction.date_.slice(0, 10) : "",
        prisonerID: editingTransaction.prisonerID?.toString() || "",
        prison_purchase_ID: editingTransaction.prison_purchase_ID?.toString() || "",
      });
      setError("");
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type_ || !form.amount || !form.date_ || !form.prisonerID) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload = {
      type_: form.type_,
      amount: parseFloat(form.amount),
      date_: form.date_,
      prisonerID: parseInt(form.prisonerID),
    };

    if (form.prison_purchase_ID) {
      payload.prison_purchase_ID = parseInt(form.prison_purchase_ID);
    }

    try {
      if (editingTransaction && editingTransaction.transaction_ID) {
        await axiosInstance.put(`/transactions/${editingTransaction.transaction_ID}`, {
          ...payload,
          transaction_ID: editingTransaction.transaction_ID,
        });
      } else {
        await axiosInstance.post("/transactions", payload);
      }
      setError("");
      onSuccess();
    } catch (err) {
      console.error("Failed to save transaction:", err);
      setError("Failed to save transaction.");
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
              <label className="form-label">Transaction Type *</label>
              <input
                type="text"
                className="form-control"
                name="type_"
                value={form.type_}
                onChange={handleChange}
                required
                placeholder="Type of transaction"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Amount *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                placeholder="Amount"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                name="date_"
                value={form.date_}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Prisoner *</label>
              <select
                className="form-select"
                name="prisonerID"
                value={form.prisonerID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Prisoner --</option>
                {prisoners.map((p) => (
                  <option key={p.prisonerID} value={p.prisonerID}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Purchase (Optional)</label>
              <select
                className="form-select"
                name="prison_purchase_ID"
                value={form.prison_purchase_ID}
                onChange={handleChange}
              >
                <option value="">-- Select Purchase --</option>
                {purchases.map((p) => (
                  <option key={p.prison_purchase_ID} value={p.prison_purchase_ID}>
                    {p.store_item_ID} {p.name_}
                  </option>
                ))}
              </select>
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

export default TransactionForm;
