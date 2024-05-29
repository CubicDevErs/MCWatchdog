import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { Link } from 'react-router-dom';

const CookieConsentNotice = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="I understand"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      expires={150}
    >
      This website uses cookies to enhance the user experience.{" "}
      <span style={{ fontSize: "10px" }}>
        By using this site, you agree to our 
        <Link to="/tos" style={{ color: "#f1d600" }}> Terms of Service </Link> 
        and 
        <Link to="/policy" style={{ color: "#f1d600" }}> Privacy Policy </Link>.
      </span>
    </CookieConsent>
  );
};

export default CookieConsentNotice;