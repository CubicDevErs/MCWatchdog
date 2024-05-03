import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { app } from "../Firebase";
import CustomNavbar from "./Navbar";
import Footer from "./Footer";
import AddServerModal from "./discord_modals/AddServerModal";
import EditServerModal from "./discord_modals/EditServerModal";
import EnableStatusModal from "./discord_modals/EnableStatusModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDiscordLinked, setIsDiscordLinked] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [discordChannels, setDiscordChannels] = useState([]);
  const [showEnableStatusModal, setShowEnableStatusModal] = useState(false);
  const host = "https://backend.mcwatchdog.com";

  const [formData, setFormData] = useState({
    serverName: "",
    serverAddress: "",
    serverPort: "",
    serverPlatform: "java",
    serverFavicon: "",
    enableNotifications: true,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentServer, setCurrentServer] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      getAuth(app),
      async (firebaseUser) => {
        if (!firebaseUser) {
          navigate("/login");
        } else {
          const storedUser = JSON.parse(sessionStorage.getItem("user"));
          if (!storedUser || storedUser.uid === null) {
            navigate("/dashboard");
          }
          setUser(firebaseUser);
          try {
            const response = await axios.get(
              `${host}/api/user/isDiscordLinked/${firebaseUser.email}`,
              {
                headers: {
                  Authorization: `${firebaseUser.uid}`,
                },
              }
            );

            if (response.data.success) {
              setIsDiscordLinked(response.data.isDiscordLinked);
              if (response.data.isDiscordLinked) {
                loadGuilds(firebaseUser.email);
              }
            } else {
              console.error(
                "Error fetching Discord link status:",
                response.data.message
              );
            }
          } catch (error) {
            console.error("Error fetching Discord link status:", error);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const loadGuilds = async (email) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    try {
      const guildResponse = await axios.get(
        `${host}/api/discord/guilds/${email}`,
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );

      if (guildResponse.data.Guilds && guildResponse.data.Guilds.length > 0) {
        setGuilds(guildResponse.data.Guilds);
      }
    } catch (error) {
      console.error("Error loading guilds:", error);
    }
  };

  const fetchDiscordChannels = async (guildId) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    try {
      const response = await axios.get(
        `${host}/api/discord/channels/${guildId}`,
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );

      setDiscordChannels(response.data);
    } catch (error) {
      console.error("Error fetching Discord channels:", error);
    }
  };

  const openDiscordAuthPopup = () => {
    const firebaseUser = getAuth(app).currentUser;
    if (firebaseUser) {
      const state = encodeURIComponent(firebaseUser.email);
      const url = `https://discord.com/oauth2/authorize?client_id=1209287940056813628&response_type=code&redirect_uri=https%3A%2F%2Fbackend.mcwatchdog.com%2Fdiscord%2Fauth%2Fredirect&scope=identify+guilds+guilds.join+email&state=${state}`;
      window.location.href = url;
    } else {
      console.error("Firebase user not found");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    e.preventDefault();
    try {
      const encodedFavicon = encodeURIComponent(formData.serverFavicon);
      const response = await axios.post(
        `${host}/api/discord/server/add/${user.email}/${formData.guildId}/${formData.serverName}/${formData.serverAddress}/${formData.serverPort}/${formData.serverPlatform}/${encodedFavicon}/${formData.enableNotifications}`,
        {},
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );

      setSuccess("Server added successfully.");
      setShowModal(false);
      loadGuilds(user.email);
    } catch (error) {
      console.error("Error adding server:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while adding the server.");
      }
    }
  };

  const handleEdit = (guildId, server) => {
    setCurrentServer({ ...server, guildId: guildId });
    setFormData({
      serverName: server.name,
      serverAddress: server.IP,
      serverPort: server.Port,
      serverPlatform: server.Platform,
      serverFavicon: server.Favicon || "",
      enableNotifications: server.Notification ? true : false,
    });
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (e) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    e.preventDefault();
    try {
      const encodedFavicon = encodeURIComponent(formData.serverFavicon);

      const response = await axios.post(
        `${host}/api/discord/server/edit/${user.email}/${currentServer.guildId}/${currentServer.name}/${formData.serverName}/${formData.serverAddress}/${formData.serverPort}/${formData.serverPlatform}/${encodedFavicon}/${formData.enableNotifications}`,
        {},
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );

      setSuccess("Server edited successfully.");
      setShowEditModal(false);
      loadGuilds(user.email);
    } catch (error) {
      console.error("Error editing server:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while editing the server.");
      }
    }
  };

  const handleDelete = async (guildId, serverName) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    try {
      await axios.post(
        `${host}/api/discord/server/remove/${user.email}/${guildId}/${serverName}`,
        {},
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );

      loadGuilds(user.email);
      setSuccess("Server deleted successfully.");
    } catch (error) {
      console.error("Error deleting server:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while deleting the server.");
      }
    }
  };

  const handleEnableStatusButtonClick = (guildId, serverName) => {
    fetchDiscordChannels(guildId);
    setShowEnableStatusModal(true);
    setFormData({ ...formData, guildId: guildId, serverName: serverName });
  };

  const handleDisableStatusButtonClick = async (guildId, serverName) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    try {
      await axios.post(
        `${host}/api/discord/server/status/disable/${user.email}/${guildId}/${serverName}`,
        {},
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );

      setSuccess("Discord status disabled successfully.");
      loadGuilds(user.email);
    } catch (error) {
      console.error("Error disabling Discord status:", error);
      setError("An error occurred while disabling Discord status.");
    }
  };

  const handleDiscordChannelSelect = (e) => {
    const selectedChannelId = e.target.value;
    setFormData({ ...formData, discordChannel: selectedChannelId });
  };

  const handleEnableStatusSubmit = async (e) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    e.preventDefault();
    try {
      const selectedChannelId = formData.discordChannel;
      const selectedChannel = discordChannels.find(
        (channel) => channel.id === selectedChannelId
      );

      if (!selectedChannel) {
        setError("Please select a channel.");
        return;
      }

      const response = await axios.post(
        `${host}/api/discord/server/status/enable/${user.email}/${formData.guildId}/${formData.serverName}/${selectedChannel.id}`,
        {},
        {
          headers: {
            Authorization: `${storedUser.uid}`,
          },
        }
      );

      setSuccess("Discord status enabled successfully.");
      setShowEnableStatusModal(false);
      loadGuilds(user.email);
    } catch (error) {
      console.error("Error enabling Discord status:", error);
      setError("An error occurred while enabling Discord status.");
    }
  };

  return (
    <>
      <CustomNavbar user={user} />
      <Container className="mt-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <h1>Discord status dashboard</h1>
            {isDiscordLinked === true ? (
              <>
                <p>Discord linked</p>
                {guilds.length > 0 ? (
                  guilds.map((guild) => (
                    <Card key={guild.id} className="mb-3 guild-card">
                      <Card.Body>
                        <Card.Title>{guild.name}</Card.Title>
                        {guild.servers.length > 0 ? (
                          guild.servers.map((server) => (
                            <Card
                              key={server.name}
                              className="mb-2 server-card"
                            >
                              <Card.Body>
                                <Card.Title>{server.name}</Card.Title>
                                <br />
                                {server.Favicon ? (
                                  <img
                                    src={server.Favicon}
                                    alt="Server Favicon"
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : (
                                  <span>No favicon available</span>
                                )}
                                <div className="server-card-text">
                                  <div className="status">
                                    <strong>Address:</strong>
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
                                    <strong>Platform:</strong>
                                    <br />
                                    {server.Platform}
                                    <br />
                                  </div>
                                  <div className="status">
                                    <strong>Notification:</strong>
                                    <br />
                                    {server.Notification
                                      ? "Enabled"
                                      : "Disabled"}
                                    <br />
                                  </div>
                                  <div className="status">
                                    <strong>Discord status:</strong>
                                    <br />
                                    {server.Tracking ? "Enabled" : "Disabled"}
                                    <br />
                                  </div>
                                </div>
                                <br />
                                <div className="dropdown">
                                  <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id={`dropdownMenuButton-${server.name}`}
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    Actions
                                  </button>
                                  <ul
                                    className="dropdown-menu"
                                    aria-labelledby={`dropdownMenuButton-${server.name}`}
                                  >
                                    {server.Tracking ? (
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleDisableStatusButtonClick(
                                              guild.id,
                                              server.name
                                            )
                                          }
                                        >
                                          Disable Discord Status
                                        </button>
                                      </li>
                                    ) : (
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleEnableStatusButtonClick(
                                              guild.id,
                                              server.name
                                            )
                                          }
                                        >
                                          Enable Discord Status
                                        </button>
                                      </li>
                                    )}
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() =>
                                          handleEdit(guild.id, server)
                                        }
                                      >
                                        Edit Server
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() =>
                                          handleDelete(guild.id, server.name)
                                        }
                                      >
                                        Delete Server
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </Card.Body>
                            </Card>
                          ))
                        ) : (
                          <p>No servers found for this guild.</p>
                        )}
                        <Button
                          variant="primary"
                          onClick={() => {
                            setShowModal(true);
                            setFormData({ ...formData, guildId: guild.id });
                          }}
                        >
                          Add Server
                        </Button>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p>You haven't yet invited the bot on a Discord guild.</p>
                )}
              </>
            ) : isDiscordLinked === false ? (
              <Button variant="success" onClick={openDiscordAuthPopup}>
                Link Discord
              </Button>
            ) : (
              <p>Checking Discord account status...</p>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
      <AddServerModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <EditServerModal
        showEditModal={showEditModal}
        handleClose={() => setShowEditModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmitEdit={handleSubmitEdit}
        setShowEditModal={setShowEditModal}
      />
      <EnableStatusModal
        showEnableStatusModal={showEnableStatusModal}
        handleClose={() => setShowEnableStatusModal(false)}
        formData={formData}
        handleDiscordChannelSelect={handleDiscordChannelSelect}
        handleEnableStatusSubmit={handleEnableStatusSubmit}
        discordChannels={discordChannels}
        setShowEnableStatusModal={setShowEnableStatusModal}
      />
    </>
  );
}