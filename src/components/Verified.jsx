import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import CustomNavbar from "./Navbar";

export default function Verified() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          navigate("/dashboard");
          return;
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  // Check email verification status every 5 seconds
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
      <Container className="mt-5 text-start">
        {user ? (
          <div>
            <h3>Email Verification Needed</h3>
            <p>
              Your email is not verified yet. Please check your email for a verification link.
              Once you verify your email, this page will refresh and you will be redirected to your dashboard.
            </p>
          </div>
        ) : (
          <p>No user is logged in.</p>
        )}
      </Container>
      <Footer />
    </div>
  );
}
