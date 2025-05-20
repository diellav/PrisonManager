import React from "react";
import { Card, Form, Button } from "react-bootstrap";

const EmergencyContactForm = ({ form, isEditing, handleInputChange, handleSubmit, handleClose }) => {
  return (
    <Card className="mb-4 shadow-sm rounded-4">
      <Card.Body>
        <h4 className="mb-4 font-weight-bold text-primary">
          {isEditing ? "Edit Emergency Contact" : "Create Emergency Contact"}
        </h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="date"
              name="date_of_birth"
              placeholder="Date of Birth"
              value={form.date_of_birth}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Select
              name="gender"
              value={form.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="address_"
              placeholder="Address"
              value={form.address_}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ms-2"
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EmergencyContactForm;
