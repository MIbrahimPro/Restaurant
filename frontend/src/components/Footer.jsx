import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const [generalInfo, setGeneralInfo] = useState(null);

  useEffect(() => {
    const fetchGeneralInfo = async () => {
      try {
        const response = await axios.get("/general");
        setGeneralInfo(response.data);
      } catch (error) {
        console.error("Error fetching general info:", error);
      }
    };

    fetchGeneralInfo();
  }, []);

  return (
    <footer className="footer mt-auto py-5">
      <div className="container">
        <div className="row gx-5">
          {/* Contact Us */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="font-heading mb-3">Contact Us</h5>
            <p className="mb-2">
              {generalInfo ? generalInfo.contactAddress : "Loading..."}
            </p>
            <p className="mb-2">
              {generalInfo ? generalInfo.contactPhone : "Loading..."}
            </p>
            <p>
              {generalInfo ? generalInfo.contactEmail : "Loading..."}
            </p>
            <div className="mt-3">
              <a
                href={generalInfo ? generalInfo.Instagram : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                <FaInstagram size={24} color="#ffbe33" />
              </a>
              <a
                href={generalInfo ? generalInfo.Facebook : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                <FaFacebookF size={24} color="#ffbe33" />
              </a>
              <a
                href={generalInfo ? generalInfo.Whatsaap : "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={24} color="#ffbe33" />
              </a>
            </div>
          </div>

          {/* About Blurb */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="font-heading mb-3">Restaurant</h5>
            <p className="text-white-50">
              The best Restaurant you can find on the internet is now offering online delivery options through this site
            </p>
          </div>

          {/* Opening Hours */}
          <div className="col-md-4">
            <h5 className="font-heading mb-3">Opening Hours</h5>
            <p className="mb-1">Everyday</p>
            <p className="ms-4">10.00 AM - 10.00 PM</p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center">
          <small className="text-white-50">
            © 2025 All Rights Reserved By Restaurant
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;