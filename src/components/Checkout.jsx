import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Container, Card, Spinner } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../Firebase";
import CustomNavbar from "./Navbar";
import Footer from "./Footer";

export default function Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      getAuth(app),
      async (firebaseUser) => {
        if (!firebaseUser) {
          navigate("/login");
        } else {
          if (!firebaseUser.emailVerified) {
            navigate("/verified");
            return;
          }
          setUser(firebaseUser);
          try {
            const response = await axios.get(
              `https://backend.mcwatchdog.com/payment/stripe-session/${firebaseUser.email}`,
              {
                headers: {
                  Authorization: firebaseUser.uid,
                },
              }
            );
            if (response.data.success) {
              setStatus("success");
              setTimeout(() => {
                navigate("/dashboard");
              }, 5000);
            } else {
              setStatus("fail");
              setErrorMessage(response.data.error);
            }
          } catch (error) {
            console.error("Error fetching stripe session status:", error);
            setStatus("fail");
            if (
              error.response &&
              error.response.data &&
              error.response.data.error
            ) {
              setErrorMessage(error.response.data.error);
            } else {
              setErrorMessage(
                "An error occurred while processing your payment. Please try again later."
              );
            }
          } finally {
            setLoading(false);
            setTimeout(() => {
              navigate("/dashboard");
            }, 5000);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div>
      <CustomNavbar user={user} />
      <Container className="mt-5 d-flex justify-content-center align-items-center">
        <Card className="info-block card" style={{ width: "18rem" }}>
          <Card.Body className="text-center">
            {loading && (
              <div className="mb-3">
                <Spinner animation="border" role="status" />
                <span className="ms-2">Loading...</span>
              </div>
            )}
            {!loading && status === "success" && (
              <div>
                <p className="text-success">Payment successful!</p>
                <p>Redirecting to dashboard...</p>
              </div>
            )}
            {!loading && status === "fail" && (
              <div>
                <p className="text-danger">{errorMessage}</p>
                <p>Redirecting to dashboard...</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}