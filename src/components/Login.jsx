import { useEffect, useRef } from "react";
import { initializeFirebaseUI } from "./FirebaseAuth";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";

export default function Login() {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      initializeFirebaseUI("#firebaseui-auth-container");
      isInitializedRef.current = true;
    }
  }, []);

  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center p-5 border rounded">
            <h1>Login</h1>
            <p className="mt-4">Sign in using your Google account or email and password:</p>
            <div id="firebaseui-auth-container" className="mt-4"></div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}