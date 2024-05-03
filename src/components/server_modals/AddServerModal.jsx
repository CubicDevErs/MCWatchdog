import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

export default function AddServerModal({
  showModal,
  setShowModal,
  serverData,
  handleInputChange,
  handleSubmit,
}) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "white" }}>Add Server</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "white" }}>
        <Form>
          <Form.Group controlId="formServerName">
            <Form.Label>Server Name</Form.Label>
            <Form.Control
              type="text"
              name="servername"
              value={serverData.servername}
              onChange={handleInputChange}
              placeholder="Enter server name"
            />
          </Form.Group>
          <Form.Group controlId="formServerIP">
            <Form.Label>Server IP</Form.Label>
            <Form.Control
              type="text"
              name="ip"
              value={serverData.ip}
              onChange={handleInputChange}
              placeholder="Enter server IP"
            />
          </Form.Group>

          <Form.Group controlId="formServerPort">
            <Form.Label>Server Port</Form.Label>
            <Form.Control
              type="text"
              name="port"
              value={serverData.port}
              onChange={handleInputChange}
              placeholder="Enter server port"
            />
          </Form.Group>

          <Form.Group controlId="formServerPlatform">
            <Form.Label>Server Platform</Form.Label>
            <Form.Control
              as="select"
              name="platform"
              value={serverData.platform}
              onChange={handleInputChange}
            >
              <option value="java">Java</option>
              <option value="bedrock">Bedrock</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formEnableNotification">
            <Form.Label>Enable Notification</Form.Label>
            <Form.Control
              as="select"
              name="enableNotification"
              value={serverData.enableNotification}
              onChange={handleInputChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit server
        </Button>
      </Modal.Footer>
    </Modal>
  );
}