const bcrypt = require("bcrypt");
const User = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const Patient = require("../models/gen_info");
const Nurse = require("../models/Nurse");
const crypto = require("crypto");
const SymptomPathologyReport = require("../models/symptom_pathology_report");

const MedicineDiseaseReport = require("../models/medicine_&_disease");

const decryptCustomId = (encryptedCustomId) => {
  const [encrypted, iv, key] = encryptedCustomId.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
exports.submitdata = async (req, res, next) => {
  try {
    const {
      name,
      email,
      ph,
      address,
      dob,
      gender,
      password,
      registration,
      department,
      role,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const user = new User({
      name,
      email,
      ph,
      role,
      department,
      registration,
      address,
      dob,
      gender,
      password: hashedPassword,
    });

    await user.validate();
    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = {};
      for (const field in error.errors) {
        errorMessages[field] = error.errors[field].message;
      }
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: errorMessages,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Please provide the input correctly",
      });
    }
  }
};

// login

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "15d",
    });

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// data Retrive API  For the doctor
exports.patientgeninformation_data_fetch = async (req, res, next) => {
  try {
    const { encryptedCustomId } = req.body;

    const originalString = decryptCustomId(encryptedCustomId);
    const delimiter = "_";
    const stringArray = originalString.split(delimiter);
    const secondPortion = stringArray[1];
    const firstPortion = stringArray[0];

    const joinedString = [firstPortion, secondPortion].join(delimiter);
    // This is For finding the Doctor and Authenticate The User
    const users = await User.find({
      customId: joinedString,
    });

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: "You are Not Allowed To See the Data",
      });
      return; // Return early if users are not found
    }

    // This is for Finding The Patient

    const patients = await Patient.find({
      encryptedCustomId,
    });

    if (patients.length === 0) {
      res.status(401).json({
        success: false,
        message: "Patient is Not Found, Try Again!!!",
      });
      return; // Return early if patients are not found
    }

    res.status(200).json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Data Retrive of the Patient  By the Nurse

exports.patientgeninformation_data_fetch_bynurse = async (req, res, next) => {
  try {
    const { encryptedCustomId } = req.body;

    const originalString = decryptCustomId(encryptedCustomId);
    const delimiter = "_";
    const stringArray = originalString.split(delimiter);
    const secondPortion = stringArray[3];
    const firstPortion = stringArray[2];
    const joinedString = [firstPortion, secondPortion].join(delimiter);

    const users = await Nurse.find({
      customId: joinedString,
    });

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: "You are Not Allowed To See the Data",
      });
      return;
    }

    const patients = await Patient.find({
      encryptedCustomId,
    });

    if (patients.length === 0) {
      res.status(401).json({
        success: false,
        message: "Patient is Not Found, Try Again!!!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//doctor Fetch 2nd Tabel

exports.patientgeninformation_data_fetch_2ndtabelby_doctor = async (
  req,
  res,
  next
) => {
  try {
    const { encryptedCustomId } = req.body;
    const hash = crypto.createHash("sha512");
    const hashedCustomId = hash.update(encryptedCustomId, "utf8").digest("hex");
    const report = await SymptomPathologyReport.findOne({
      second_encryptedCustomId: hashedCustomId,
    });
    if (!report) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authentication",
      });
    }
    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Nurse Fetch 2nd Tabel
exports.patientgeninformation_data_fetch_2ndtabelby_Nurse = async (
  req,
  res,
  next
) => {
  try {
    const { encryptedCustomId } = req.body;
    const hash = crypto.createHash("sha512");
    const hashedCustomId = hash.update(encryptedCustomId, "utf8").digest("hex");
    const report = await SymptomPathologyReport.findOne({
      second_encryptedCustomId: hashedCustomId,
    });
    if (!report) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authentication",
      });
    }
    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Doctor Fetch 3nd Tabel

exports.patientgeninformation_data_fetch_3ndtabelby_doctor = async (
  req,
  res,
  next
) => {
  try {
    const { encryptedCustomId } = req.body;
    // console.log(customId);

    const hash = crypto.createHash("sha256");
    const hashedCustomId = hash.update(encryptedCustomId, "utf8").digest("hex");
    // console.log(hashedCustomId);

    // Find the entry based on the hashed customId
    const report = await MedicineDiseaseReport.findOne({
      super_encryptedCustomId: hashedCustomId,
    });
    // console.log(report);

    if (!report) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authentication",
      });
    }
    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Nurse Fetch 3nd Tabel
exports.patientgeninformation_data_fetch_3ndtabelby_nurse = async (
  req,
  res,
  next
) => {
  try {
    const { encryptedCustomId } = req.body;
    // console.log(customId);

    const hash = crypto.createHash("sha256");
    const hashedCustomId = hash.update(encryptedCustomId, "utf8").digest("hex");
    // console.log(hashedCustomId);

    // Find the entry based on the hashed customId
    const report = await MedicineDiseaseReport.findOne({
      super_encryptedCustomId: hashedCustomId,
    });
    // console.log(report);

    if (!report) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authentication",
      });
    }
    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//doctor update 2nd tabel   how to do that
exports.updateMedicineDiseaseReport = async (req, res, next) => {
  try {
    const { encryptedCustomId, updatedFields } = req.body;

    const hash = crypto.createHash("sha256");
    const hashedCustomId = hash.update(encryptedCustomId, "utf8").digest("hex");

    // Find the entry based on the hashed customId
    const report = await MedicineDiseaseReport.findOne({
      super_encryptedCustomId: hashedCustomId,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Update the fields
    for (const key in updatedFields) {
      if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
        report[key] = updatedFields[key];
      }
    }

    // Save the updated report
    await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      updatedReport: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//docotor Updated the 3rd tabel

exports.updatesymtomreport = async (req, res, next) => {
  try {
    const { encryptedCustomId, updatedFields } = req.body;

    const hash = crypto.createHash("sha512");
    const hashedCustomId = hash.update(encryptedCustomId, "utf8").digest("hex");

    // Find the entry based on the hashed customId
    const report = await SymptomPathologyReport.findOne({
      second_encryptedCustomId: hashedCustomId,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Update the fields
    for (const key in updatedFields) {
      if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
        report[key] = updatedFields[key];
      }
    }

    // Save the updated report
    await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      updatedReport: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//doctor Remove the Patient from his list and Remove him from his list and decrese the Limit
exports.dischargePatient = async (req, res, next) => {
  try {
    const { encryptedCustomId } = req.body;
    // Find the patient and doctor

    const patient = await Patient.findOne({
      encryptedCustomId: encryptedCustomId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const originalString = decryptCustomId(encryptedCustomId);
    const delimiter = "_";
    const stringArray = originalString.split(delimiter);
    const secondPortion = stringArray[1];
    const firstPortion = stringArray[0];
    const thirdportion = stringArray[2];
    const fourthportion = stringArray[3];

    const joinedString = [firstPortion, secondPortion].join(delimiter);
    const nursejoinedString = [thirdportion, fourthportion].join(delimiter);

    // This is For finding the Doctor and Authenticate The User
    const doctor = await User.findOne({ customId: joinedString }).exec();
    const nurse = await Nurse.findOne({ customId: nursejoinedString }).exec();

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "You are Not Allowed To See the Data",
      });
    }

    // Check if the doctor's limit is greater than 0
    if (doctor.limit <= 0) {
      return res.status(403).json({
        success: false,
        message: "Doctor limit reached. Cannot discharge patient.",
      });
    }

    // Decrease the doctor's limit by 1
    doctor.limit -= 1;
    await doctor.save();

    // Decrease the nurse's limit by 1 (Assuming you have a nurse associated with the patient)
    if (nurse) {
      nurse.limit -= 1;
      await nurse.save();
    }

    // Perform the discharge logic (update patient status, etc.)
    patient.status = "discharged";
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient discharged successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
