import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { app } from "../Firebase";
import { Button, Container, Row, Col } from "react-bootstrap";
import CustomNavbar from "./Navbar";
import InstructionModal from "./home_modals/InstructionModal";
import { FaAndroid, FaApple } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        if (firebaseUser && typeof window.Android !== "undefined") {
          window.Android.getFirebase(JSON.stringify(firebaseUser));
        }
      }
    });

    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes("android"));
    setIsIOS(
      userAgent.includes("iphone") ||
        userAgent.includes("ipad") ||
        userAgent.includes("ipod")
    );

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div>
      <CustomNavbar user={user} />
      <Container fluid className="hero-section">
        <Row className="justify-content-center align-items-center">
          <Col md={6} className="text-center">
            <div className="hero-content">
              <h1>MCWatchdog</h1>
              <p className="lead">Tracking minecraft servers made easy</p>
            </div>
          </Col>
          <Col md={6} className="text-center">
            <div className="hero-img">
              <img
                src="/images/statusdog.jpeg"
                alt="banner no info doggy"
                className="img-fluid"
              />
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="mt-5 mb-3">
        {!isAndroid && !isIOS && (
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <div className="section">
                <FaAndroid size={48} color="green" />
                <h2>MCWatchdog for Android</h2>
                <Button
                  variant="secondary"
                  as="a"
                  href="https://mcwatchdog.com/MCWatchdog.apk"
                  download
                >
                  Click here to download
                </Button>
              </div>
            </Col>
            <Col md={6} className="text-center">
              <div className="section">
                <FaApple size={48} color="white" />
                <h2>MCWatchdog for iOS</h2>
                <Button variant="secondary" onClick={handleShow}>
                  Install instructions
                </Button>
              </div>
            </Col>
          </Row>
        )}

        <Row className="justify-content-center mt-5">
          <Col md={6} className="text-start">
            <div className="info-block card">
              <h3 className="text-white text-center">Server Trackers</h3>
              <div className="info-section">
                <h5 className="text-white text-center">Overview</h5>
                <p>
                  Server trackers provide real-time updates on your Minecraft
                  server's status.
                </p>
              </div>
              <div className="info-section">
                <h5 className="text-white text-center">Notification System</h5>
                <p>
                  Our servers continuously monitor your server's status. If your
                  server goes offline and notifications are enabled, we'll send
                  push notifications to your devices (Android, iOS, and
                  browsers).
                </p>
              </div>
              <div className="info-section">
                <h5 className="text-white text-center">Tip</h5>
                <p>
                  If you prefer not to receive notifications, you can easily
                  turn them off.
                </p>
              </div>
            </div>
          </Col>
          <Col md={6} className="text-start">
            <div className="info-block card">
              <h3 className="text-white text-center">Discord Trackers</h3>
              <div className="info-section">
                <h5 className="text-white text-center">Overview</h5>
                <p>
                  Discord trackers allows you to display your Minecraft server
                  in a discord embed which will be automatically update itself.
                </p>
              </div>
              <div className="info-section">
                <h5 className="text-white text-center">Notification System</h5>
                <p>
                  When a server has been detected as offline our discord bot
                  will send a DM (if enabled). Do note that only the Guild owner
                  will be notified.{" "}
                </p>
              </div>
              <div className="info-section">
                <h5 className="text-white text-center">Tip</h5>
                <p>
                  Notifications will only be received when you have set them up
                  and your DM is open.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <InstructionModal showModal={showModal} handleClose={handleClose} />
    </div>
  );
}
