import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Footer from "./Footer";
import CustomNavbar from "./Navbar";

export default function Policy() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Effect triggered");

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <CustomNavbar user={user} />
      <Container className="mt-5 mb-2 text-start">
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us.</p>
        <p>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you use our website and application.
        </p>

        <h2>1. Information We Collect</h2>
        <p>MCWatchdog collects the following personal information:</p>
        <ul>
          <li>Email</li>
          <li>Display name</li>
          <li>Discord tokens</li>
          <li>Discord owner ID</li>
          <li>Guild ID</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the collected information to provide and improve our services.
          We do not share your personal information with third parties except to
          the extent necessary to provide the services offered by MCWatchdog.
        </p>

        <h2>3. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to
          provide you with our services and as described in this Privacy Policy.
        </p>

        <h2>4. Security</h2>
        <p>
          We take reasonable precautions to protect your personal information
          from unauthorized access, use, or disclosure.
        </p>

        <h2>5. Changes to This Privacy Policy</h2>
        <p>
          MCWatchdog reserves the right to update or change our Privacy Policy
          at any time. Any changes will be effective immediately upon posting
          the updated Privacy Policy on the website.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us.
        </p>
      </Container>
      <Footer />
    </div>
  );
}