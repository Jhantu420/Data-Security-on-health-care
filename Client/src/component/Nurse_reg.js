import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  RiUserFill,
  RiMailFill,
  RiLockPasswordFill,
  RiPhoneFill,
  RiMapPin2Fill,
  RiVipCrown2Fill,
} from "react-icons/ri";

import "../CSS/Signup.css";
import Signup from "../Asset/signup.png";

const NurseRegistrationForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      ph: "",
      dob: "",
      gender: "",
      address: {
        state: "",
        city: "",
      },
      department: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      ph: Yup.string()
        .matches(/^\d{10}$/, "Invalid phone number")
        .required("Required"),
      dob: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
        .required("Required"),
      gender: Yup.string().required("Required"),
      address: Yup.object().shape({
        state: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
      }),
      department: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/nurseregister",
          values
        );
        alert(
          "Registration Successful! Data: " + JSON.stringify(response.data)
        );
        console.log(response.data);
      } catch (error) {
        // Handle error here
        console.error(error.response.data);
      }
    },
  });

  return (
    <>
      <div className="mtext1">Welcome Nurse</div>
      <div className="mtext2">SignUp to Join</div>
      <div className="s-main">
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
            <div
              className={`input-group ${formik.errors.email ? "error" : ""}`}
            >
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
            </div>
            <div className="input-group">
              <RiPhoneFill className="input-icon" />
              <input
                type="text"
                name="ph"
                onChange={formik.handleChange}
                value={formik.values.ph}
                placeholder="Phone"
                className={`underlined-input ${
                  formik.errors.ph ? "error" : ""
                }`}
              />
              {formik.errors.ph && (
                <div className="error-message">{formik.errors.ph}</div>
              )}
            </div>
            <div className="input-group">
              <RiMapPin2Fill className="input-icon" />
              <input
                type="Date"
                name="dob"
                onChange={formik.handleChange}
                value={formik.values.dob}
                placeholder="Date of Birth"
                className={`underlined-input ${
                  formik.errors.dob ? "error" : ""
                }`}
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
              <input
                type="text"
                name="address.state"
                onChange={formik.handleChange}
                value={formik.values.address.state}
                placeholder="State"
                className={`underlined-input ${
                  formik.errors["address.state"] ? "error" : ""
                }`}
              />
              {formik.errors["address.state"] && (
                <div className="error-message">
                  {formik.errors["address.state"]}
                </div>
              )}
              <input
                type="text"
                name="address.city"
                onChange={formik.handleChange}
                value={formik.values.address.city}
                placeholder="City"
                className={`underlined-input ${
                  formik.errors["address.city"] ? "error" : ""
                }`}
              />
              {formik.errors["address.city"] && (
                <div className="error-message">
                  {formik.errors["address.city"]}
                </div>
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
                <option value="Hematology">Hematology</option>
                <option value="Neurology">Neurology</option>
                <option value="Radiology">Radiology</option>
                <option value="Rheumatology">Rheumatology</option>
                <option value="Urology">Urology</option>
              </select>
            </div>
            <div className="lll3">
              Have an account ? <span className="ll31">Sign In</span>
            </div>
            <button type="submit" className="submit-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NurseRegistrationForm;
