import React, { useState, useEffect, useCallback } from "react";
import { Container, Col, Row, Card, Button } from "react-bootstrap";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../Firebase";
import { getMessaging, getToken } from "firebase/messaging";
import UpgradeAccountModal from "./dashboard_modal/UpgradeAccountModal";
import SettingsModal from "./dashboard_modal/SettingsModal";

import { Link } from "react-router-dom";
import Footer from "./Footer";
import CustomNavbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const host = "https://backend.mcwatchdog.com";
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const handleSettingClose = () => setShowSettingsModal(false);
  const handleSettingShow = () => setShowSettingsModal(true);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser.emailVerified) {
        navigate("/verified");
        return;
      }
      if (firebaseUser) {
        setUser(firebaseUser);
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if (!storedUser || storedUser.uid === null) {
          sendUserDataToBackend(firebaseUser);
          sessionStorage.setItem("user", JSON.stringify(firebaseUser));
        }

        getUserInfo(firebaseUser);

        if (firebaseUser && typeof window.Android !== "undefined") {
          window.Android.getFirebase(JSON.stringify(firebaseUser));
        }

        if ("Notification" in window && Notification.permission === "granted") {
          setupFirebaseMessaging(firebaseUser);
        } else if ("Notification" in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              setupFirebaseMessaging(firebaseUser);
            } else {
              console.log("Notification permission denied.");
            }
          });
        } else {
          console.log("Notifications not supported.");
        }
      } else {
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const getUserInfo = async (firebaseUser) => {
    try {
      const response = await axios.get(
        `${host}/api/user/getinfo/${firebaseUser.email}`,
        {
          headers: {
            Authorization: firebaseUser.uid,
          },
        }
      );

      setUserInfo(response.data.userInfo);
      localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo));
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const sendUserDataToBackend = async (firebaseUser) => {
    try {
      const { email, displayName, emailVerified, uid } = firebaseUser;
      const apiUrl = `${host}/api/user/add`;
      const headers = {
        Authorization: firebaseUser.uid,
        "Content-Type": "application/json",
      };
      const userData = {
        email,
        displayName,
        emailVerified,
        uid,
      };

      await axios.post(apiUrl, userData, { headers });
    } catch (error) {
      console.error("Error sending user data to backend:", error);
    }
  };

  const setupFirebaseMessaging = (firebaseUser) => {
    const messaging = getMessaging();

    getToken(messaging, {
      vapidKey:
        "BGf86W5Ol6d2C3gMQ73w5IhJeQlqWPKr_lvUV7bTGcR0YrkEvN9feOvWji4VgycDoGLfbNCQACF4CgvO3B_rn8c",
    })
      .then((currentToken) => {
        if (currentToken) {
          const storedToken = sessionStorage.getItem("notificationToken");
          if (!storedToken || storedToken !== currentToken) {
            sessionStorage.setItem("notificationToken", currentToken);
            try {
              axios
                .post(
                  `${host}/api/user/fcmtoken/${firebaseUser.email}/${currentToken}`,
                  {},
                  {
                    headers: {
                      Authorization: `${firebaseUser.uid}`,
                    },
                  }
                )
                .then((response) => {})
                .catch((error) => {
                  console.error("Error sending token:", error);
                });
            } catch (error) {
              console.error("Error sending token:", error);
            }
          }
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  };

  const onLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("user");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const renderPremiumTier = (premiumMember) => {
    let premiumTier;
    switch (premiumMember) {
      case 0:
        premiumTier = "Free Tier";
        break;
      case 1:
        premiumTier = "Server Tier";
        break;
      case 2:
        premiumTier = "Discord Tier";
        break;
      case 3:
        premiumTier = "Watchdog Tier";
        break;
      default:
        premiumTier = "Unknown";
    }
    return <p>{premiumTier}</p>;
  };

  return (
    <div>
      <CustomNavbar user={user} />
      <Container fluid className="mt-4">
        <Row>
          <Col md={3}>
            <div className="d-flex flex-column">
              <Button variant="dark" className="mb-2 custom-button">
                <Link to="/servertracker" className="link">
                  Server tracker
                </Link>
              </Button>
              <Button variant="dark" className="mb-2 custom-button">
                <Link to="/discordtracker" className="link">
                  Discord tracker
                </Link>
              </Button>
              <Button
                variant="dark"
                className="mb-2 custom-button"
                onClick={handleShow}
              >
                Upgrade account
              </Button>

              <Button variant="dark" className="mb-2 custom-button">
                <Link
                  to="https://discord.com/oauth2/authorize?client_id=1209287940056813628&redirect_uri=https%3A%2F%2Fmcwatchdog.com&permissions=2147502080&scope=bot"
                  className="link"
                >
                  Discord bot invite
                </Link>
              </Button>
              <Button
                variant="dark"
                className="mb-2 custom-button"
                onClick={handleSettingShow}
              >
                Settings
              </Button>
              <Button
                variant="dark"
                className="mb-2 custom-button"
                onClick={onLogout}
              >
                Logout
              </Button>
            </div>
          </Col>
          <Col md={9}>
            <Row>
              <Col md={6}>
                <Card className="info-block">
                  <Card.Body className="text-white">
                    <Card.Title>Account status</Card.Title>
                    <br />
                    {userInfo ? (
                      <div className="row">
                        <div className="col-md-6">
                          <div className="info-element mb-4">
                            <h6 className="text-white">Discord trackers</h6>
                            <div className="progress">
                              <div
                                className="progress-bar progress-bar-striped bg-info"
                                role="progressbar"
                                style={{
                                  width: `${
                                    (userInfo.ActiveServersCount / 5) * 100
                                  }%`,
                                }}
                                aria-valuenow={userInfo.ActiveServersCount}
                                aria-valuemin="0"
                                aria-valuemax="5"
                              >
                                {userInfo.ActiveServersCount} / 5
                              </div>
                            </div>
                          </div>
                          <div className="info-element mb-4">
                            <h6 className="text-white">Server trackers</h6>
                            <div className="progress">
                              <div
                                className="progress-bar progress-bar-striped bg-info"
                                role="progressbar"
                                style={{
                                  width: `${
                                    (userInfo.ServersDataCount / 5) * 100
                                  }%`,
                                }}
                                aria-valuenow={userInfo.ServersDataCount}
                                aria-valuemin="0"
                                aria-valuemax="5"
                              >
                                {userInfo.ServersDataCount} / 5
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="info-element mb-4">
                            <h6 className="text-white">Discord Linked</h6>
                            <p>{userInfo.IsDiscordLinked ? "Yes" : "No"}</p>
                          </div>
                          <div className="info-element mb-4">
                            <h6 className="text-white">Discord Guilds</h6>
                            <p>{userInfo.DiscordDataCount}</p>
                          </div>
                          <div className="info-element mb-4">
                            <h6 className="text-white">Premium Tier</h6>
                            {renderPremiumTier(userInfo.PremiumMember)}
                          </div>
                          <div className="info-element mb-4">
                            <h6 className="text-white">Notification Clients</h6>
                            <p>{userInfo.FCMTokensCount}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>Loading user info...</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="info-block text-start">
                  <Card.Body>
                    <Card.Title className="text-white text-center">
                      MCWatchdog Premium
                    </Card.Title>
                    <br />
                    <div className="info-section">
                      <h5 style={{ color: "white", textAlign: "center" }}>
                        Free Tier
                      </h5>
                      <p>
                        You can have up to 2 server and Discord tracker with
                        notification support.
                      </p>
                    </div>
                    <div className="info-section">
                      <h5 style={{ color: "white", textAlign: "center" }}>
                        Server Tier
                      </h5>
                      <p>
                        You can have up to 5 server trackers with each its own
                        push notification.
                      </p>
                    </div>
                    <div className="info-section">
                      <h5 style={{ color: "white", textAlign: "center" }}>
                        Discord Tier
                      </h5>
                      <p>
                        You can have up to 5 Discord trackers with each its own
                        DM notification.
                      </p>
                    </div>
                    <div className="info-section">
                      <h5 style={{ color: "white", textAlign: "center" }}>
                        Watchdog Tier
                      </h5>
                      <p>Server Tier and Discord Tier combined.</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Card className="info-block">
                  <Card.Body>
                    <Card.Title className="text-white">
                      Setup server trackers
                    </Card.Title>
                    <Card.Text>
                      Login into MCWatchdog and navigate to the server tracker
                      section, simply add your server into the panel and we do
                      everything else.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="info-block">
                  <Card.Body>
                    <Card.Title className="text-white">
                      Setup Discord trackers
                    </Card.Title>
                    <Card.Text as="div">
                      <ol>
                        <li className="text-white">
                          Login to MCWatchdog and click "Link Discord".
                        </li>
                        <li className="text-white">
                          Link your Discord account to MCWatchdog. Use{" "}
                          <code>/link</code> if you've already invited the bot.
                        </li>
                        <li className="text-white">
                          Invite our bot to your server.
                        </li>
                        <li className="text-white">
                          Add your server in the Guild section.
                        </li>
                        <li className="text-white">
                          Enable Discord status for your server in the actions
                          menu.
                        </li>
                        <li className="text-white">
                          Submit and wait up to 5 minutes for the status to
                          update in the designated channel.
                        </li>
                      </ol>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <UpgradeAccountModal showModal={showModal} handleClose={handleClose} />
      <SettingsModal
        showModal={showSettingsModal}
        handleClose={handleSettingClose}
      />
      <Footer />
    </div>
  );
}