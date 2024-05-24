import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, Card, } from "react-bootstrap";
import Footer from "./Footer";
import CustomNavbar from "./Navbar";

export default function Verified() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          navigate("/dashboard");
          return;
        }
        setUser(firebaseUser);
      } else {
        navigate("/home");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);


  useEffect(() => {
    const interval = setInterval(() => {
      const auth = getAuth();
      auth.currentUser.reload().then(() => {
        if (auth.currentUser.emailVerified) {
          navigate("/dashboard");
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div>
      <CustomNavbar user={user} />
      <Container className="mt-5 d-flex justify-content-center align-items-center">
        <Card className="info-block card" >
          <Card.Body className="text-center">
            <Card.Title style={{ color: "white" }} >
              Email Verification Needed
            </Card.Title>
            <Card.Text>
              Your email is not verified yet. Please check your email for a verification link.
              Once you verify your email, this page will refresh and you will be redirected to your dashboard.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
