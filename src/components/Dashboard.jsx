import React, { useState, useEffect } from "react";
import { Container, Col, Row, Card, Button } from "react-bootstrap";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../Firebase";
import { getMessaging, getToken } from "firebase/messaging";
import UpgradeAccountModal from "./dashboard_modal/UpgradeAccountModal";
import SettingsModal from "./dashboard_modal/SettingsModal";
import ServerSetupModal from "./dashboard_modal/GuidesModal";

import { Link } from "react-router-dom";
import CustomNavbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from 'chart.js/auto';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const host = "https://backend.mcwatchdog.com";
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGuidesModal, setShowGuidesModal] = useState(false); 
  const handleGuidesClose = () => setShowGuidesModal(false);
  const handleGuidesShow = () => setShowGuidesModal(true);
  const handleSettingClose = () => setShowSettingsModal(false);
  const handleSettingShow = () => setShowSettingsModal(true);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo));
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const getPastMonthDates = () => {
      const dates = [];
      const currentDate = new Date();
      for (let i = 29; i >= 0; i--) {
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - i);
        dates.push(pastDate.toISOString().split('T')[0]);
      }
      return dates;
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get(`${host}/api/user/playerhistory/${user.email}`, {
          headers: {
            Authorization: user.uid,
          },
        });

        if (response.data.success) {
          const serverData = response.data.data;
          const labels = getPastMonthDates().map(date => new Date(date).toISOString().split('T')[0]);

          const colors = ['rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)', 'rgb(54, 162, 235)', 'rgb(255, 255, 255)'];
          const datasets = serverData.map((server, index) => ({
            label: server.ServerName,
            data: labels.map(date => {
              const historyEntry = server.PlayerHistory.find(entry => entry.date === date);
              return historyEntry ? historyEntry.maxPlayerCount : 0;
            }),
            fill: false,
            borderColor: colors[index % colors.length],
            tension: 0.1,
          }));

          const data = {
            labels,
            datasets,
          };

          const options = {
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Players',
                },
                ticks: {
                  stepSize: 500,
                  min: 0,
                  max: 5000,
                },
              },
            },
          };

          const ctx = document.getElementById('chart');
          if (ctx) {
            new Chart(ctx, {
              type: 'line',
              data: data,
              options: options,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching player history:", error);
      }
    };

    fetchChartData();

    return () => {
      // Cleanup function
      const ctx = document.getElementById('chart');
      if (ctx) {
        const chartInstance = Chart.getChart(ctx);
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
  }, [user]); 
  
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
                .then((response) => { })
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
    return premiumTier;
  };

  return (
    <div>
      <CustomNavbar user={user} />
      <Container fluid className="mt-4">
        <Row>
          <Col md={3} style={{ marginBottom: '30px' }}>
            <div className="d-flex flex-column">
              <Button variant="dark" className="mb-2 custom-button">
                <Link to="/servertracker" className="link">
                  Servers Dashboard
                </Link>
              </Button>
              <Button variant="dark" className="mb-2 custom-button">
                <Link to="/discordtracker" className="link">
                  Discord Dashboard
                </Link>
              </Button>
              <Button
                variant="dark"
                className="mb-2 custom-button"
                onClick={handleGuidesShow}
              >
                Setup guides
              </Button>
              <Button variant="dark" className="mb-2 custom-button">
                <Link
                  to="https://discord.com/oauth2/authorize?client_id=1209287940056813628&redirect_uri=https%3A%2F%2Fmcwatchdog.com&permissions=2147502080&scope=bot"
                  className="link"
                >
                  MCWatchdog bot invite
                </Link>
              </Button>
              <Button
                variant="dark"
                className="mb-2 custom-button"
                onClick={handleShow}
              >
                Upgrade account
              </Button>
              <Button
                variant="dark"
                className="mb-2 custom-button"
                onClick={handleSettingShow}
              >
                Account Settings
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
                <Card className="status-block">
                  <Card.Body className="text-white d-flex align-items-center justify-content-center">
                    <div className="status-icon-container">
                      <i className="status-icon bi bi-hdd-rack"></i>
                    </div>
                    {isLoading ? (
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center">
                        <Card.Title className="card-status-text status-count">{userInfo.ServersDataCount} / 5</Card.Title>
                        <Card.Text className="card-status-text status-text">Trackers</Card.Text>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="status-block">
                  <Card.Body className="text-white d-flex align-items-center justify-content-center">
                    <div className="status-icon-container">
                      <i className="status-icon bi bi-discord"></i>
                    </div>
                    {isLoading ? (
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center">
                        <Card.Title className="card-status-text status-count">{userInfo.ActiveServersCount} / 5</Card.Title>
                        <Card.Text className="card-status-text status-text">Trackers</Card.Text>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="status-block">
                  <Card.Body className="text-white d-flex align-items-center justify-content-center">
                    <div className="status-icon-container">
                      <i className="status-icon bi bi-arrow-clockwise"></i>
                    </div>
                    {isLoading ? (
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center">
                        <Card.Title className="card-status-text status-count">{renderPremiumTier(userInfo.PremiumMember)}</Card.Title>
                        <Card.Text className="card-status-text status-text">Subscription</Card.Text>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="status-block">
                  <Card.Body className="text-white d-flex align-items-center justify-content-center">
                    <div className="status-icon-container">
                      <i className="status-icon bi bi-bell"></i>
                    </div>
                    {isLoading ? (
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center">
                        <Card.Title className="card-status-text status-count">{userInfo.FCMTokensCount}</Card.Title>
                        <Card.Text className="card-status-text status-text">Notification</Card.Text>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Card className="info-block text-start">
                  <Card.Body>
                    <Card.Title className="text-white" style={{ color: "white", textAlign: "center" }}>
                      Player count history
                    </Card.Title>
                    <canvas className="chart" id="chart" width="400" height="400"></canvas>
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
      <ServerSetupModal showModal={showGuidesModal} handleClose={handleGuidesClose} />
    </div>
  );
}