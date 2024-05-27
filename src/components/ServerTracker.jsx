import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { app } from "../Firebase";
import CustomNavbar from "./Navbar";
import AddServerModal from "./server_modals/AddServerModal";

export default function Dashboard() {
  const host = "https://backend.mcwatchdog.com";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [user, setUser] = useState(null);
  const [servers, setServers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [serverData, setServerData] = useState({
    servername: "",
    ip: "",
    port: "",
    platform: "java",
    enableNotification: "yes",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
      } else {
        if (!firebaseUser.emailVerified) {
          navigate("/verified");
          return;
        }
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (!storedUser || storedUser.uid === null) {
          navigate("/dashboard");
        }

        setUser(firebaseUser);
        loadServerStatuses(firebaseUser.email);
      }
    });

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          setTimer(300);
          if (user) {
            loadServerStatuses(user.email);
          }
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigate, user]);

  useEffect(() => {
    const fetchServers = setInterval(() => {
      if (user) {
        loadServerStatuses(user.email);
      }
    }, 60000 * 5);

    return () => clearInterval(fetchServers);
  }, [user]);

  const loadServerStatuses = async (email) => {
    setLoading(true);
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    try {
      const response = await axios.get(`${host}/api/servers/get/${email}`, {
        headers: {
          Authorization: `${storedUser.uid}`,
        },
      });
      setServers(response.data.servers);
    } catch (error) {
      console.error("Error loading server statuses:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred while loading server statuses.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setServerData({ ...serverData, [name]: value });
  };

  const handleSubmit = async () => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    try {
      await axios.post(
        `${host}/api/servers/add/${user.email}/${serverData.servername}/${serverData.ip}/${serverData.port}/${serverData.platform}/${serverData.enableNotification}`,
        {},
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );
      loadServerStatuses(user.email);
      setServerData({
        servername: "",
        ip: "",
        port: "",
        platform: "java",
        enableNotification: "yes",
      });
    } catch (error) {
      console.error("Error adding server:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred while adding the server.");
      }
    } finally {
      setShowModal(false);
    }
  };

  const handleDelete = async (serverName) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    try {
      await axios.post(
        `${host}/api/servers/remove/${user.email}/${serverName}`,
        {},
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );
      loadServerStatuses(user.email);
    } catch (error) {
      console.error("Error deleting server:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred while deleting the server.");
      }
    }
  };

  return (
    <div>
<CustomNavbar user={user} />
      <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={12} className="text-center">
          <h1>Server tracker dashboard</h1>
          <Button
            variant="primary"
            className="ml-2"
            onClick={() => setShowModal(true)}
          >
            Add Server
          </Button>
          <div>Refresh status: {timer}</div>
        </Col>
      </Row>
        {loading && (
          <div className="text-center mb-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {errorMessage && (
          <Alert
            variant="danger"
            onClose={() => setErrorMessage(null)}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
        <Row className="mt-4">
          {servers.map((server, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="minecraft-card">
                <Card.Body>
                  <Card.Title>{server.ServerName}</Card.Title>
                  <div
                    className={`status ${
                      server.Status === "Online"
                        ? "online"
                        : server.Status === "Offline"
                        ? "offline"
                        : "unknown"
                    }`}
                  >
                    <strong>Status:</strong>
                    <br />
                    {server.Status === "Unknown"
                      ? "Unknown"
                      : server.Status === "Online"
                      ? "Online"
                      : "Offline"}
                  </div>
                  <div className="status">
                    <strong>Players:</strong>
                    <br />{" "}
                    {server.Players
                      ? `${server.Players.online} / ${server.Players.max}`
                      : "N/A"}
                  </div>
                  <div className="status">
                    <div className="status">
                      <strong>Adress:</strong>
                      <br />
                      {server.IP}
                      <br />
                    </div>
                    <div className="status">
                      <strong>Port:</strong>
                      <br />
                      {server.Port}
                      <br />
                    </div>
                    <div className="status">
                      <strong>MOTD:</strong>
                      <br />
                      {server.MOTD}
                      <br />
                    </div>
                    <div className="status">
                      <strong>Platform:</strong>
                      <br />
                      {server.Platform}
                      <br />
                    </div>
                    <div className="status">
                      <strong>Version:</strong>
                      <br />
                      {server.Version}
                      <br />
                    </div>
                  </div>
                  <br />
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(server.ServerName)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <AddServerModal
          showModal={showModal}
          setShowModal={setShowModal}
          serverData={serverData}
          setServerData={setServerData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </Container>
    </div>
  );
}