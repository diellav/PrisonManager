import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const PrisonPurchasesForm = ({ editingPurchase, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    store_item_ID: "",
    quantity: "",
    total_price: "",
    date_: "",
    prisoner_account_ID: "",
    approved_by: "",
  });

  const [error, setError] = useState("");

  const [storeItems, setStoreItems] = useState([]);
  const [prisonerAccounts, setPrisonerAccounts] = useState([]);
  const [guardStaff, setGuardStaff] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const storeItemsRes = await axiosInstance.get("/store_items");
        const prisonerAccountsRes = await axiosInstance.get("/prisoner_accounts");
        const guardStaffRes = await axiosInstance.get("/guard_staff");

        setStoreItems(storeItemsRes.data);
        setPrisonerAccounts(prisonerAccountsRes.data);
        setGuardStaff(guardStaffRes.data);
      } catch (err) {
        console.error("Failed to fetch lists:", err);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    if (editingPurchase) {
      setForm({
        store_item_ID: editingPurchase.store_item_ID ? editingPurchase.store_item_ID.toString() : "",
        quantity: editingPurchase.quantity !== null ? editingPurchase.quantity.toString() : "",
        total_price: editingPurchase.total_price !== null ? editingPurchase.total_price.toString() : "",
        date_: editingPurchase.date_ ? editingPurchase.date_.slice(0, 10) : "",
        prisoner_account_ID: editingPurchase.prisoner_account_ID ? editingPurchase.prisoner_account_ID.toString() : "",
        approved_by: editingPurchase.approved_by ? editingPurchase.approved_by.toString() : "",
      });
    } else {
      setForm({
        store_item_ID: "",
        quantity: "",
        total_price: "",
        date_: "",
        prisoner_account_ID: "",
        approved_by: "",
      });
    }
  }, [editingPurchase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !form.store_item_ID ||
      !form.quantity ||
      !form.total_price ||
      !form.date_ ||
      !form.prisoner_account_ID ||
      !form.approved_by
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const store_item_ID = parseInt(form.store_item_ID, 10);
    const quantity = parseInt(form.quantity, 10);
    const total_price = parseFloat(form.total_price);
    const prisoner_account_ID = parseInt(form.prisoner_account_ID, 10);
    const approved_by = parseInt(form.approved_by, 10);
    if (
      [store_item_ID, quantity, total_price, prisoner_account_ID, approved_by].some(
        (val) => isNaN(val)
      )
    ) {
      setError("Please enter valid numeric values.");
      return;
    }

    const payload = {
      store_item_ID,
      quantity,
      total_price,
      date_: form.date_,
      prisoner_account_ID,
      approved_by,
    };

    try {
      if (editingPurchase) {
        await axiosInstance.put(`/prison_purchases/${editingPurchase.prison_purchase_ID}`, {
          ...payload,
          prison_purchase_ID: editingPurchase.prison_purchase_ID,
        });
      } else {
        await axiosInstance.post("/prison_purchases", payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving purchase:", err.response || err.message || err);
      setError("Failed to save prison purchase.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingPurchase ? "Edit Prison Purchase" : "Create Prison Purchase"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">Store Item</label>
              <select
                className="form-select"
                name="store_item_ID"
                value={form.store_item_ID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Store Item --</option>
                {storeItems.map((item) => (
                  <option key={item.store_item_ID} value={item.store_item_ID}>
                    ID:{item.store_item_ID} - {item.name_}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min={1}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Total Price</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="total_price"
                value={form.total_price}
                onChange={handleChange}
                required
                min={0}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Date</label>
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
              <label className="form-label">Prisoner Account</label>
              <select
                className="form-select"
                name="prisoner_account_ID"
                value={form.prisoner_account_ID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Prisoner Account --</option>
                {prisonerAccounts.map((acc) => (
                  <option key={acc.prisoner_account_ID} value={acc.prisoner_account_ID}>
                    {acc.account_name || `ID: ${acc.prisoner_account_ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Approved By (Guard Staff)</label>
              <select
                className="form-select"
                name="approved_by"
                value={form.approved_by}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Guard Staff --</option>
                {guardStaff.map((guard) => (
                  <option key={guard.guard_staff_ID} value={guard.guard_staff_ID}>
                    {guard.first_name} {guard.last_name}
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
              {editingPurchase ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrisonPurchasesForm;