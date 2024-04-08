import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  RiMailFill,
  RiLockPasswordFill,
  RiUserFill,
  RiCalendar2Fill,
  RiVipCrown2Fill,
  RiMapPin2Fill,
  RiPhoneFill,
} from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../CSS/Signup.css";
import Signup from "../Asset/signup.png";

const SigninForm = ({ theme }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      dob: "",
      gender: "",
      address: {
        state: "",
        city: "",
      },
      ph: "",
      department: "",
      registration: "",
      role: "Doctor",
      passwordVisible: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Required"),
      dob: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
        .required("Required"),
      gender: Yup.string()
        .oneOf(["Male", "Female", "Others"])
        .required("Required"),
      state: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      ph: Yup.string()
        .matches(/^\d{10}$/, "Invalid phone number")
        .required("Required"),
      department: Yup.string().required("Required"),
      registration: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/register",
          values
        );

        if (response.data.success) {
          const userDetails = JSON.stringify(values, null, 2);
          alert(`Registration successful.....\n\n${userDetails}`);
          console.log(response.data);
        } else if (response.data.existingUser) {
          alert("A user with this email already exists.");
        } else {
          console.error("Error while submitting data:", response.data.message);
        }
      } catch (error) {
        console.error(
          "Error while submitting data:",
          error.response.data.message
        );
      }
    },
  });

  const togglePasswordVisibility = () => {
    formik.setFieldValue("passwordVisible", !formik.values.passwordVisible);
  };

  return (
    <div className={`s-main ${theme === "dark" ? "dark" : ""}`}>
      <div className="img">
        <img src={Signup} alt="Signup" />
      </div>
      <div className="registration-form-container">
        <form className="registration-form" onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <RiUserFill className="input-icon" />
            <input
              type="text"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              placeholder="Name"
              className={`underlined-input ${
                formik.errors.name ? "error" : ""
              }`}
            />
            {formik.errors.name && (
              <div className="error-message">{formik.errors.name}</div>
            )}
          </div>
          <div className={`input-group ${formik.errors.email ? "error" : ""}`}>
            <RiMailFill className="input-icon" />
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Email"
              className={`underlined-input ${
                formik.errors.email ? "error" : ""
              }`}
            />
            {formik.errors.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>
          <div className="input-group">
            <RiLockPasswordFill className="input-icon" />
            <input
              type={formik.values.passwordVisible ? "text" : "password"}
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="Password"
              className={`underlined-input ${
                formik.errors.password ? "error" : ""
              }`}
            />
            {formik.errors.password && (
              <div className="error-message">{formik.errors.password}</div>
            )}

            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {formik.values.passwordVisible ? (
                <AiOutlineEye />
              ) : (
                <AiOutlineEyeInvisible />
              )}
            </span>
          </div>

          <div className="input-group">
            <RiCalendar2Fill className="input-icon" />
            <input
              type="date"
              name="dob"
              onChange={formik.handleChange}
              value={formik.values.dob}
              placeholder="Date of Birth"
              className={`underlined-input ${formik.errors.dob ? "error" : ""}`}
            />
            {formik.errors.dob && (
              <div className="error-message">{formik.errors.dob}</div>
            )}
          </div>
          <div className="input-group">
            <RiVipCrown2Fill className="input-icon" />
            <select
              name="gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
              className={`underlined-input ${
                formik.errors.gender ? "error" : ""
              }`}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            {formik.errors.gender && (
              <div className="error-message">{formik.errors.gender}</div>
            )}
          </div>

          <div className="input-group">
            <RiMapPin2Fill className="input-icon" />
            <input
              type="text"
              name="state"
              onChange={formik.handleChange}
              value={formik.values.state}
              placeholder="State"
              className={`underlined-input ${
                formik.errors.state ? "error" : ""
              }`}
            />
            {formik.errors.state && (
              <div className="error-message">{formik.errors.state}</div>
            )}
            <input
              type="text"
              name="city"
              onChange={formik.handleChange}
              value={formik.values.city}
              placeholder="City"
              className={`underlined-input ${
                formik.errors.city ? "error" : ""
              }`}
            />
            {formik.errors.city && (
              <div className="error-message">{formik.errors.city}</div>
            )}
          </div>
          <div className="input-group">
            <RiPhoneFill className="input-icon" />
            <input
              type="text"
              name="ph"
              onChange={formik.handleChange}
              value={formik.values.ph}
              placeholder="Phone"
              className={`underlined-input ${formik.errors.ph ? "error" : ""}`}
            />
            {formik.errors.ph && (
              <div className="error-message">{formik.errors.ph}</div>
            )}
          </div>
          <div className="input-group">
            <select
              id="department"
              name="department"
              onChange={formik.handleChange}
              value={formik.values.department}
              className={`underlined-input ${
                formik.errors.department ? "error" : ""
              }`}
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="Nephrology">Nephrology</option>
              <option value="Gynecology">Gynecology</option>
            </select>
          </div>
          <div className="input-group">
            <RiUserFill className="input-icon" />{" "}
            <input
              type="text"
              name="registration"
              onChange={formik.handleChange}
              value={formik.values.registration}
              placeholder="Registration ID"
              className={`underlined-input ${formik.errors.ph ? "error" : ""}`}
            />
            {formik.errors.ph && (
              <div className="error-message">{formik.errors.ph}</div>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="submit-button">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninForm;
