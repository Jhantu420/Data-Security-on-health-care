import React, { useState } from "react";
import { RiMailFill, RiLockPasswordFill } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup"; // Import Yup for form validation
import { useFormik } from "formik";
import "../CSS/Login.css";
import img from "../Asset/signup.png";

const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      subrole: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
      subrole: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const { email, password, subrole } = values;
      handleLogin(email, password, subrole);
    },
  });

  const handleLogin = async (email, password, subrole) => {
    if (!email || !password || !subrole) {
      alert("Please provide email, password, and select a subrole.");
      return;
    }

    let loginUrl;
    switch (subrole) {
      case "doctor":
        loginUrl = "http://localhost:4000/api/v1/logindoctor";
        break;
      case "nurse":
        loginUrl = "http://localhost:4000/api/v1/loginnurse";
        break;
      default:
        loginUrl = "http://localhost:4000/api/v1/login";
    }

    const data = { email, password };

    try {
      const response = await axios.post(loginUrl, data);
      // console.log("API Response:", response);

      if (response.status === 200 && response.data.success) {
        // Authentication successful
        localStorage.setItem("token", response.data.token);
        // Redirect to the appropriate dashboard based on subrole
        switch (subrole) {
          case "doctor":
            navigate("/doctor-dashboard");
            break;
          case "nurse":
            navigate("/nurse-dashboard");
            break;
          default:
            navigate("/patient-dashboard");
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in: " + error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="mtext1">Welcome Back</div>
      <div className="mtext2">Login to continue</div>
      <div className="main">
        <div className="img">
          <img src={img} alt="Signup" />
        </div>
        <div className="registration-form-container">
          <form className="registration-form" onSubmit={formik.handleSubmit}>
            <div className="input-group">
              <RiMailFill className="input-icon" />
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="Email"
                className={`underlined-input ${
                  formik.touched.email && formik.errors.email ? "error" : ""
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="error-message">{formik.errors.email}</div>
            ) : null}
            <div className="input-group">
              <RiLockPasswordFill className="input-icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Password"
                className={`underlined-input ${
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : ""
                }`}
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {passwordVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}
            <div className="input-group">
              <select
                name="subrole"
                value={formik.values.subrole}
                onChange={formik.handleChange}
                className={`underlined-input ${
                  formik.touched.subrole && formik.errors.subrole ? "error" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="patient">Patient</option>
              </select>
            </div>
            {formik.touched.subrole && formik.errors.subrole ? (
              <div className="error-message">{formik.errors.subrole}</div>
            ) : null}
            <div className="ll1">
              <div className="ll2">Forgot Password ?</div>
              <div className="ll3">
                Create new account ? <span className="ll31">Sign Up</span>
              </div>
            </div>
            <div className="button-group">
              <button type="submit" className="admin-button">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
