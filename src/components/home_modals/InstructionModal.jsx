import React from "react";
import { Modal, Button } from "react-bootstrap";

const instructionModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "white" }}>
          {" "}
          How to Add a Web App to Your Home Screen
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "white" }}>
        <p>
          <strong>How to add MCWatchdog to your home screen</strong>
        </p>
        <ol>
          <li>Open Safari on your iPhone or iPad.</li>
          <li>Navigate to MCWatchdog.com.</li>
          <li>Tap the Action button (often called the Share button).</li>
          <li>
            Scroll down the share sheet past the rows of contacts and apps, then
            select Add to Home Screen.
          </li>
          <li>Give the web app a name, then tap Add.</li>
        </ol>
        <p>
          Your new web app will appear in the next available space on your
          device's home screen. If you tap it and you're kicked back to the
          standard website, force quit Safari, then launch the web app again.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default instructionModal;