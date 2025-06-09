import React, { useState, useEffect } from "react";
  import { Card, Form, Button } from "react-bootstrap";
  import axiosInstance from "../axios";

  const PrisonerAccountForm = ({ selectedAccount, onSuccess, onCancel }) => {
    const [form, setForm] = useState({
      prisonerID: "",
      balance: "",
      status_: "",
    });

    useEffect(() => {
      if (selectedAccount) {
        setForm({
          prisonerID: selectedAccount.prisonerID || "",
          balance: selectedAccount.balance || "",
          status_: selectedAccount.status_ || "",
        });
      }
    }, [selectedAccount]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (selectedAccount) {
          await axiosInstance.put(`/prisoner_accounts/${selectedAccount.prisoner_account_ID}`, form);
        } else {
          await axiosInstance.post("/prisoner_accounts", form);
        }
        onSuccess();
        setForm({
          prisonerID: "",
          balance: "",
          status_: "",
        });
      } catch (err) {
        console.error("Error saving prisoner account:", err);
      }
    };

    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>{selectedAccount ? "Edit Prisoner Account" : "Create Prisoner Account"}</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="prisonerID" className="mb-3">
              <Form.Label>Prisoner ID</Form.Label>
              <Form.Control
                type="number"
                name="prisonerID"
                value={form.prisonerID}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="balance" className="mb-3">
              <Form.Label>Balance</Form.Label>
              <Form.Control
                type="number"
                name="balance"
                value={form.balance}
                onChange={handleChange}
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group controlId="status_" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status_"
                value={form.status_}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedAccount ? "Update" : "Create"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  export default PrisonerAccountForm;