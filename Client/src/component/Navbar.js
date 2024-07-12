import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../CSS/Navbar.css";
import Logo from "../Asset/Logo.jpeg";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import Toggle_light from "../Asset/Toggle_light.png";
import Toggle_dark from "../Asset/Toggle_dark.png";

function Navbar({ theme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (!isLoggedIn && location.pathname === "/doctor-dashboard") {
      navigate("/"); // Redirect to home page if not logged in and trying to access doctor-dashboard
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const toggleMode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <div className="navbar">
      <img src={Logo} alt="Logo" className="logo" />
      <ul className="menu-items">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/sign-in" onClick={handleLogout}>
                Logout
              </Link>
            </li>
            <li>
              <Link to="/doctor-dashboard">Dashboard</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/sign-in">Login</Link>
            </li>
            <li>
              <div className="dropdown">
                <div className="dropdown-toggle" onClick={handleDropdownToggle}>
                  Register
                </div>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/doctor-sign-up">Doctor</Link>
                    </li>
                    <li>
                      <Link to="/nurse-sign-up">Nurse</Link>
                    </li>
                    <li>
                      <Link to="/sign-up">Patient</Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <div className="cal">
              <div className="crl">
                <div className="content-wrapper">
                  <div className="icon-wrapper">
                    <LiaPhoneVolumeSolid className="icon" />
                  </div>
                  <pre className="text">Call Us: 91-968-169-3120 TTY711</pre>
                </div>
              </div>
            </div>
          </>
        )}
      </ul>
      <img
        onClick={toggleMode}
        src={theme === "light" ? Toggle_light : Toggle_dark}
        alt=""
        className="toggle_icon"
      />
    </div>
  );
}

export default Navbar;
