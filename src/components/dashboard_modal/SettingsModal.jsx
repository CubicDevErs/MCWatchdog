import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Card,
  DropdownButton,
  Dropdown,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const SettingsModal = ({ showModal, handleClose }) => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const [responseMessage, setResponseMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  const host = "https://backend.mcwatchdog.com";

  const handleUnlinkDiscord = async () => {
    try {
      const response = await axios.post(
        `${host}/discord/resetDiscordData/${storedUser.email}`,
        {},
        {
          headers: {
            Authorization: storedUser.uid,
          },
        }
      );
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage(error.response.data.message);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post(
        `${host}/payment/cancel-subscription/${storedUser.email}`,
        {},
        {
          headers: {
            Authorization: storedUser.uid,
          },
        }
      );
      setResponseMessage(response.data.success);
    } catch (error) {
      setResponseMessage(error.response.data.error);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await axios.post(
        `${host}/payment/cancel-subscription/${storedUser.email}`,
        {},
        {
          headers: {
            Authorization: storedUser.uid,
          },
        }
      );
      const response = await axios.delete(
        `${host}/api/user/delete/${storedUser.email}`,
        {
          headers: {
            Authorization: storedUser.uid,
          },
        }
      );
      if (response.status === 200) {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            sessionStorage.removeItem("user");
            navigate("/home");
          })
          .catch((error) => {
            console.error("Error signing out:", error);
          });
      }
    } catch (error) {
      setResponseMessage(error.response.data.error);
    }
  };

  const handleModalClose = () => {
    setResponseMessage("");
    setShowDeleteConfirmation(false);
    handleClose();
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} centered>
      <Modal.Header closeButton style={{ color: "white" }}>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "white" }}>
        <Card
          className="info-block"
          text="white"
          style={{ marginBottom: "20px" }}
        >
          <Card.Body>
            <Card.Title>Account Settings</Card.Title>
            <ul>
              <li>
                Unlink Discord: This option will remove all Discord data from
                your account, including all your Discord trackers.
              </li>
              <br />
              <li>
                Cancel Subscription: We will cancel your subscription
                immediately. You can continue to use your subscription until the
                end of the current billing period.{" "}
              </li>
              <br />
              <li>
                Delete Account: We will cancel your subscription (if any) and
                remove all your data from our database. Note that neither you
                nor we will be able to revert this action.
              </li>
            </ul>
            <div className="d-flex justify-content-center">
              <DropdownButton
                variant="danger"
                title="Settings"
                className="full-width-btn"
              >
                <Dropdown.Item onClick={handleUnlinkDiscord}>
                  Unlink Discord account
                </Dropdown.Item>
                <Dropdown.Item onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteAccount}>
                  Delete Account
                </Dropdown.Item>
              </DropdownButton>
            </div>
            {responseMessage && (
              <Alert variant="info" className="mt-3">
                {responseMessage}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: "none" }}>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "white" }}>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "white" }}>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteAccount}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default SettingsModal;
