import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Footer from "./Footer";
import CustomNavbar from "./Navbar";

export default function TermsOfService() {
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
      console.log("Cleanup function");
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <CustomNavbar user={user} />
      <Container className="mt-5 text-start">
        <h1>Terms of Service</h1>
        <p>Welcome to MCWatchdog!</p>
        <p>
          These terms and conditions outline the rules and regulations for the
          use of MCWatchdog's website and application. By accessing this website
          and/or using our application, we assume you accept these terms and
          conditions. Do not continue to use MCWatchdog if you do not agree to
          take all of the terms and conditions stated on this page.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using MCWatchdog, you agree to be bound by these Terms of Service,
          all applicable laws, and regulations, and agree that you are
          responsible for compliance with any applicable local laws. If you do
          not agree with any of these terms, you are prohibited from using or
          accessing this site.
        </p>

        <h2>2. User Data</h2>
        <p>
          MCWatchdog collects the following user data for the purpose of
          providing our services:
        </p>
        <ul>
          <li>Email</li>
          <li>Display name</li>
          <li>Discord tokens</li>
          <li>Discord owner ID</li>
          <li>Guild ID</li>
        </ul>
        <p>We do not handle sensitive data such as passwords.</p>

        <h2>3. Usage</h2>
        <p>
          Users agree not to misuse MCWatchdog's services. Users agree not to
          reproduce, duplicate, copy, sell, resell, or exploit any portion of
          the service, use of the service, or access to the service without
          express written permission by MCWatchdog.
        </p>

        <h2>4. Disclaimer</h2>
        <p>
          MCWatchdog provides its service on an "as is" and "as available"
          basis. We do not warrant that the service will be uninterrupted,
          timely, secure, or error-free. We reserve the right to modify or
          discontinue the service at any time without notice.
        </p>

        <h2>5. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance
          with the laws of Belgium, and you irrevocably submit to the exclusive
          jurisdiction of the courts in that State or location.
        </p>
      </Container>
      <Footer />
    </div>
  );
}