import React, { useState, useEffect } from "react";
import { FaPaypal, FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrolledToBottom = documentHeight - scrollTop === windowHeight;

      setIsVisible(scrolledToBottom);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 d-flex justify-content-between align-items-center">
                <div className="text-center">
                  <p>&copy; {new Date().getFullYear()} CubicDevErs</p>
                </div>
                <div className="d-flex align-items-center">
                  <div style={{ marginRight: "10px" }}>
                    <Link to="/tos" className="text-white">
                      Terms of Service
                    </Link>
                  </div>
                  <div>
                    <Link to="/policy" className="text-white">
                      Policy
                    </Link>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <a
                      href="https://www.paypal.com/donate/?hosted_button_id=YJM4TWDU2V5J4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaPaypal size={24} color="white" />
                    </a>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <a
                      href="https://discord.gg/3kmNFjFmew"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaDiscord size={24} color="white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}