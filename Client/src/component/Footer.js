// Footer.js
import React from "react";
import { FaInstagram, FaDribbble, FaTwitter, FaYoutube } from "react-icons/fa";
import "../CSS/Footer.css"; // Import the CSS file
import Logo from "../Asset/Logo.jpeg";
const Footer = () => {
  const socialLinks = [
    { label: "YouTube", icon: FaYoutube },
    { label: "Instagram", icon: FaInstagram },
    { label: "Twitter", icon: FaTwitter },
    { label: "Dribbble", icon: FaDribbble },
  ];

  const links = [
    [
      { label: "Company", key: "header-1" },
      { label: "About us", key: "item-1-1" },
      { label: "Blog", key: "item-1-2" },
      { label: "Contact us", key: "item-1-3" },
      { label: "Pricing", key: "item-1-4" },
      { label: "Testimonials", key: "item-1-5" },
    ],
    [
      { label: "Support", key: "header-2" },
      { label: "Help center", key: "item-2-1" },
      { label: "Terms of service", key: "item-2-2" },
      { label: "Legal", key: "item-2-3" },
      { label: "Privacy policy", key: "item-2-4" },
      { label: "Status", key: "item-2-5" },
    ],
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src={Logo}
            alt="Company Logo"
            className="logo"
          />
          <span className="footer-brand-name">MedWay</span>
        </div>
        <div className="footer-info">
          <div className="footer-social-links">
            {socialLinks.map((socialLink, index) => {
              const Icon = socialLink.icon;
              return (
                <Icon key={`social-${index}`} className="footer-social-icon" />
              );
            })}
          </div>
        </div>
        <div className="footer-links">
          {links.map((col, index) => {
            return (
              <ul
                className={`footer-links-col col-${index + 1}`}
                key={`col-${index}`}
              >
                {col.map((link, index) => {
                  return (
                    <li
                      key={`link-${col}-${index}`}
                      className={`footer-link ${
                        link.key === "header-1" || link.key === "header-2"
                          ? "footer-link-header"
                          : ""
                      }`}
                    >
                      {link.label}
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
        <div className="footer-subscribe">
          <label className="footer-subscribe-label">Stay up to date</label>
          <div className="footer-subscribe-input">
            <input
              type="email"
              placeholder="Subscribe to our email"
              className="footer-input"
            />
            <button className="footer-button">Subscribe</button>
          </div>
          <div className="footer-copyright-container">
            <span className="footer-copyright">
              Copyright © 2024 MedWay. All rights reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
