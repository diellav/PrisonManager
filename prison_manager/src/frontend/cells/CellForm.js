import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CellForm = ({ showModal, handleClose, form, isEditing, handleInputChange, handleSubmit }) => {
  const setCategoryByBlockName = (blockName) => {
    switch (blockName) {
      case 'A':
      case 'B':
        return 'Maximum Security';
      case 'C':
      case 'D':
      case 'E':
        return 'Medium Security';
      case 'F':
        return 'Minimum Security';
      case 'G':
        return 'Juvenile Section';
      case 'H':
        return 'Isolation';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (form.block_name) {
      const category = setCategoryByBlockName(form.block_name);
      handleInputChange({
        target: {
          name: "category",
          value: category,
        },
      });
    }
  }, [form.block_name, handleInputChange]);
  
  

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Cell Block" : "Create Cell Block"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Select
              name="block_name"
              value={form.block_name}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Block Name</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="cell_number"
              placeholder="Cell Number"
              value={form.cell_number}
              onChange={handleInputChange}
              maxLength={10}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={form.capacity}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="actual_capacity"
              placeholder="Actual Capacity"
              value={form.actual_capacity}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleInputChange}
              required
              readOnly
            />
          </Form.Group>

          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant={isEditing ? "warning" : "primary"} type="submit" className="ms-2">
            {isEditing ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CellForm;
