const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  customId: {
    type: String,
    default: function () {
      return "custom_" + Date.now();
    },
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    validate: {
      validator: function (value) {
        return value.length >= 8;
      },
      message: "Password must be at least 8 characters long.",
    },
    match: [/^(?=.*[a-zA-Z])(?=.*\d).*$/, "Password must be alphanumeric."],
  },
  ph: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: "Phone number should contain exactly 10 digits.",
    },
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required."],
    validate: {
      validator: function (value) {
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        return dateFormat.test(value.toISOString().slice(0, 10));
      },
      message: 'Date of Birth should be in the format "YYYY-MM-DD."',
    },
  },
  gender: {
    type: String,
    required: [true, "Gender is required."],
    enum: {
      values: ["Male", "Female", "Other"],
      message:
        'Invalid gender, Please choose from "male," "female," or "other."',
    },
  },
  address: {
    state: {
      type: String,
      required: [true, "State is required."],
    },
    city: {
      type: String,
      required: [true, "City is required."],
    },
  },
  registration: {
    type: String,
    required: [true, "Registration number is required."],
  },
  role: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: [true, "Specialization is required."],
  },
  limit: {
    type: Number, 
    default: 0,   
  },
  encryptedCustomId: {
    type: String,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
