import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CellForm = ({
  showModal,
  handleClose,
  form,
  isEditing,
  handleInputChange,
  handleSubmit,
  blocks,
}) => {
  const setCategoryByBlockId = (blockId) => {
    const selectedBlock = blocks.find((block) => block.block_id === blockId);
    return selectedBlock ? selectedBlock.category : "";
  };

  useEffect(() => {
    if (form.block_id) {
      const category = setCategoryByBlockId(form.block_id);
      if (form.category !== category) {
        handleInputChange({
          target: {
            name: "category",
            value: category,
          },
        });
      }
    }
  }, [form.block_id, form.category, blocks, handleInputChange]);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Cell Block" : "Create Cell Block"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Block</Form.Label>
            <Form.Select
              name="block_id"
              value={form.block_id || ""}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: "block_id",
                    value: parseInt(e.target.value), 
                  },
                })
              }
              required
            >
              <option value="">Select Block</option>
              {blocks.map((block) => (
                <option key={block.block_id} value={block.block_id}>
                  {block.block_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cell Number</Form.Label>
            <Form.Control
              type="text"
              name="cell_number"
              value={form.cell_number}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Actual Capacity</Form.Label>
            <Form.Control
              type="number"
              name="actual_capacity"
              value={form.actual_capacity}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              disabled
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant={isEditing ? "warning" : "primary"} type="submit" className="ms-2">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CellForm;
