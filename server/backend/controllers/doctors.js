const bcrypt = require("bcrypt");
const User = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const EncryptedId = require("../models/store_id");
const report = require("../models/Symptoms_Report");
const Medicine_Disease = require("../models/Medicine_Disease");
const patient = require("../models/gen_info");

const Patient = require("../models/gen_info");

// Function to encrypt the customId
// Function to encrypt the customId
const encryptfUNCTION = (customId) => {
  const algorithm = "aes-256-cbc";
  const key = "poiuytrewqasdfghjklmnbvcxzzxcvbn";
  const iv = "mnbvcxzasdfghjkl";
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(customId, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${encrypted}:${iv.toString("hex")}:${key.toString("hex")}`;
};
const decryptFUNCTION = (encryptedCustomIds) => {
  if (!encryptedCustomIds) {
    // Handle the case where encryptedCustomIds is undefined
    return ""; // Or throw an error, depending on your logic
  }

  const [encrypted, iv, key] = encryptedCustomIds.split(":");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

const encryptionFunctionforMedcine_Tbel = (customId) => {
  const algorithm = "aes-256-cbc";
  const key = "poiuytrewqasdfghjklmnbvcxzasdfgh";
  const iv = "jukiolpytrfgescv";
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(customId, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${encrypted}:${iv.toString("hex")}:${key.toString("hex")}`;
};
const encryptionFunctionforSymptoms_Tbel = (customId) => {
  const algorithm = "aes-256-cbc";
  const key = "udosisisksldifmcroqazxcvbnmdhsdh";
  const iv = "qwertyuioplkjhgf";
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(customId, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${encrypted}:${iv.toString("hex")}:${key.toString("hex")}`;
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
    const encryptedemail = encryptfUNCTION(email);
    const existingUser = await User.findOne({ email: encryptedemail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }
    if (address && address.state) {
      address.state = encryptfUNCTION(address.state.toString());
    }
    if (address && address.city) {
      address.city = encryptfUNCTION(address.city.toString());
    }

    const encryptedName = encryptfUNCTION(name);
    const encryptedEmail = encryptfUNCTION(email);
    const encryptedGender = encryptfUNCTION(gender);
    const encryptedDept = encryptfUNCTION(department);
    const encryptedDOB = encryptfUNCTION(dob);
    const encryptedPH = encryptfUNCTION(ph);
    const encryptedregistration = encryptfUNCTION(registration);
    const encryptedrole = encryptfUNCTION(role);

    const user = new User({
      name: encryptedName,
      email: encryptedEmail,
      ph: encryptedPH,
      role: encryptedrole,
      department: encryptedDept,
      registration: encryptedregistration,
      address,
      dob: encryptedDOB,
      gender: encryptedGender,
      password: hashedPassword,
    });
    console.log("5");

    // await user.validate();  for savinng the doctor

    await user.save();
    console.log("6");

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

    const encryptedEmail = encryptfUNCTION(email);
    console.log(encryptedEmail);
    const user = await User.findOne({ email: encryptedEmail });
    console.log(password);
    console.log(email);
    console.log(user);
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

    const decryptedAddress = {
      state: decryptFUNCTION(user.address.state),
      city: decryptFUNCTION(user.address.city),
    };

    const decryptedUser = {
      ...user.toObject(),
      address: decryptedAddress,
      name: decryptFUNCTION(user.name),
      dob: decryptFUNCTION(user.dob),
      gender: decryptFUNCTION(user.gender),
      ph: decryptFUNCTION(user.ph),
      email: decryptFUNCTION(user.email),
      department: decryptFUNCTION(user.department),
      role: decryptFUNCTION(user.role),
      customId: user.customId,
      password: user.password,
    };

    console.log("dsa");
    const token = jwt.sign({ userId: user._id, customId: user.customId  }, "your-secret-key", {
      expiresIn: "15d",
    });
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      success: true,
      token,
      user: decryptedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//logout

exports.logout = async (req, res, next) => {
  try {
    // Invalidate the token by setting it to null
    const user = req.user;
    const token = null; // Set the token to null or revoke it on the server side

    res.status(200).json({
      success: true,
      message: "Logout successful.",
      user: null, // Optionally send back user as null
      token: null, // Set the token to null in the response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Doctor Get the Acess of the Store based on her request of patient
exports.getAllEncryptedIds = async (req, res, next) => {
  try {
    const encryptedIds = await EncryptedId.find();

    const customId = req.params.customId;

    const decryptedIds = encryptedIds.map((encryptedId) => {
      const decryptedId = decryptFUNCTION(encryptedId.encryptedId);
      const decryptedName = decryptFUNCTION(encryptedId.name);
      const decryptedEmail = decryptFUNCTION(encryptedId.email);

      const splitIds = decryptedId.split("_");

      const combinedId = splitIds.slice(0, 2).join("_");

      const match = combinedId === customId;

      return {
        ...encryptedId.toObject(),
        name: decryptedName,
        email: decryptedEmail,
        match,
      };
    });

    const matchedIds = decryptedIds.filter((id) => id.match);

    res.status(200).json({
      success: true,
      encryptedIds: matchedIds,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

///doctor can fetch his profile
exports.getProfile = async (req, res, next) => {
  try {
    // Check if req.user is defined
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    // Assuming User model is imported and findById method is available
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const decryptedAddress = {
      state: decryptFUNCTION(user.address.state),
      city: decryptFUNCTION(user.address.city),
    };
    const decryptedUser = {
      ...user.toObject(),
      address: decryptedAddress,
      name: decryptFUNCTION(user.name),
      dob: decryptFUNCTION(user.dob),
      gender: decryptFUNCTION(user.gender),
      ph: decryptFUNCTION(user.ph),
      email: decryptFUNCTION(user.email),
      department: decryptFUNCTION(user.department),
      registration: decryptFUNCTION(user.registration),
      role: decryptFUNCTION(user.role),
      customId: user.customId,
      password: user.password,
    };
    res.status(200).json({
      success: true,
      message: "User Fetch Successfully",
      user: decryptedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//doctor want to fecth the 2nd tabel and 3rd tabel

exports.medicineTbel = async (req, res, next) => {
  try {
    const { encryptedCustomId } = req.body;

    const hashedSuperEncryptedCustom = crypto
      .createHash("sha256")
      .update(encryptedCustomId)
      .digest("hex");

    const medicinetabeldata = await Medicine_Disease.find({
      super_encryptedCustomId: hashedSuperEncryptedCustom,
    });

    if (!medicinetabeldata || !medicinetabeldata.length) {
      return res.status(404).json({
        success: false,
        message: "No medicine table data found for the user",
      });
    }
    const lastObjectIndex = medicinetabeldata.length - 1;
    const lastObject = medicinetabeldata[lastObjectIndex];

    const DesiesDetail = lastObject.DiseaseDetails[0];
    const NameofMedicine = lastObject.NameOfMedicine;
    const Description = lastObject.Description;
    const UsageInstructions = lastObject.UsageInstructions;
    const decryptedDesiesDetail = decryptFUNCTION(DesiesDetail);
    const decryptedDescription = decryptFUNCTION(Description);
    const decryptedNameOfMedicine = decryptFUNCTION(NameofMedicine);
    const decryptedUsageInstruction = decryptFUNCTION(UsageInstructions);

    // Decrypt the last object
    const decryptmedicaldata = {
      DiseaseDetails: decryptedDesiesDetail,
      NameOfMedicine: decryptedNameOfMedicine,
      Description: decryptedDescription,
      UsageInstructions: decryptedUsageInstruction,
    };

    res.status(200).json({
      success: true,
      message: "User Fetch Successfully",
      medicinetabeldata: decryptmedicaldata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// doctor fetch the 3rd tabel

exports.symptreportneTbel = async (req, res, next) => {
  try {
    const { encryptedCustomId } = req.body;

    const hashedSuperEncryptedCustom = crypto
      .createHash("sha512")
      .update(encryptedCustomId)
      .digest("hex");

    const reportabeldata = await report.find({
      second_encryptedCustomId: hashedSuperEncryptedCustom,
    });

    if (!reportabeldata || !reportabeldata.length) {
      return res.status(404).json({
        success: false,
        message: "No medicine table data found for the user",
      });
    }
    const symtpreportext = reportabeldata[0].reportText;
    const symptom = reportabeldata[0].symptoms;
    const decryptedsymptomreport = decryptFUNCTION(symtpreportext);
    const decryptedsymptom = decryptFUNCTION(symptom);

    const decryptedreports = {
      reportText: decryptedsymptomreport,
      symptom: decryptedsymptom,
    };

    res.status(200).json({
      success: true,
      message: "User Fetch Successfully",
      reportabeldata: decryptedreports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // Check if req.user is defined
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    // Validate dob field
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    // Update all fields without decrypting
    if (req.body.name) {
      updatedUser.name = encryptfUNCTION(req.body.name);
    }
    if (req.body.dob) {
      updatedUser.dob = encryptfUNCTION(req.body.dob);
    }
    if (req.body.gender) {
      updatedUser.gender = encryptfUNCTION(req.body.gender);
    }
    if (req.body.address && req.body.address.state) {
      updatedUser.address.state = encryptfUNCTION(req.body.address.state);
    }
    if (req.body.address && req.body.address.city) {
      updatedUser.address.city = encryptfUNCTION(req.body.address.city);
    }
    if (req.body.ph) {
      updatedUser.ph = encryptfUNCTION(req.body.ph);
    }
    if (req.body.email) {
      updatedUser.email = encryptfUNCTION(req.body.email);
    }
    if (req.body.password) {
      // If you want to update the password, hash it before storing
      updatedUser.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.department) {
      updatedUser.department = encryptfUNCTION(req.body.department);
    }
    if (req.body.registration) {
      updatedUser.registration = encryptfUNCTION(req.body.registration);
    }
    if (req.body.role) {
      updatedUser.role = encryptfUNCTION(req.body.role);
    }
    // Save the updated updatedUser
    const Userupdated = await updatedUser.save();
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: Userupdated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// doctor edit the medicine and disease tabel
exports.updatethemedicineTbel = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }
    const { encryptedCustomId } = req.body;
    const hashedSecondEncryptedCustom = crypto
      .createHash("sha256")
      .update(encryptedCustomId)
      .digest("hex");

    let updateData = {
      Description: req.body.updateData.Description,
      DiseaseDetails: req.body.updateData.DiseaseDetails,
      NameOfMedicine: req.body.updateData.NameOfMedicine,
      UsageInstructions: req.body.updateData.UsageInstructions,
    };
    console.log(updateData.DiseaseDetails);
    if (updateData.Description) {
      updateData.Description = encryptionFunctionforMedcine_Tbel(
        updateData.Description
      );
    }
    if (updateData.DiseaseDetails) {
      updateData.DiseaseDetails = encryptionFunctionforMedcine_Tbel(
        updateData.DiseaseDetails.toString()
      );
    }
    if (updateData.NameOfMedicine) {
      updateData.NameOfMedicine = encryptionFunctionforMedcine_Tbel(
        updateData.NameOfMedicine
      );
    }
    if (updateData.UsageInstructions) {
      updateData.UsageInstructions = encryptionFunctionforMedcine_Tbel(
        updateData.UsageInstructions
      );
    }
    const medicinedata = await Medicine_Disease.findOneAndUpdate(
      {
        super_encryptedCustomId: hashedSecondEncryptedCustom,
      },
      updateData,
      {
        new: true,
      }
    );
    await medicinedata.save();

    res.status(200).json({
      success: true,
      message: "Report data updated successfully",
      medicinedata: medicinedata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update the Symptom Tbale

exports.updatethesymptomsTbele = async (req, res, next) => {
  try {
    // Check if req.user is defined
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const { encryptedCustomId } = req.body;

    // Hash the encryptedCustomId
    const hashedSecondEncryptedCustom = crypto
      .createHash("sha512")
      .update(encryptedCustomId)
      .digest("hex");

    // Assuming PatientSymptomPathologyReport model is imported
    let updateData = {
      symptoms: req.body.updateData.symptoms,
      reportText: req.body.updateData.reportText,
    };
    console.log(updateData);

    // Check if values exist and encrypt them
    if (updateData.symptoms) {
      updateData.symptoms = encryptionFunctionforSymptoms_Tbel(
        updateData.symptoms
      );
    }
    if (updateData.reportText) {
      updateData.reportText = encryptionFunctionforSymptoms_Tbel(
        updateData.reportText
      );
    }

    console.log(updateData);
    // Update the reporttabeldata
    const reporttabeldata = await report.findOneAndUpdate(
      {
        second_encryptedCustomId: hashedSecondEncryptedCustom,
      },
      updateData,
      {
        new: true,
      }
    );
    await reporttabeldata.save();

    // Return the updated report data
    res.status(200).json({
      success: true,
      message: "Report data updated successfully",
      reporttabeldata: reporttabeldata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// doctor deleting his own profile

exports.deleteProfilesbythedoctor = async (req, res, next) => {
  try {
    // Assuming User model is imported and findByIdAndDelete method is available
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getuserprofile_patient = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const { encryptedCustomId } = req.body;
    // console.log(req.user);
    const patients = await Patient.find({
      encryptedCustomId: encryptedCustomId,
    });

    if (patients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User Not Found  why",
      });
    }
     // Decrypt patient data before sending response
     const decryptedPatients = patients.map(patient => {
      return {
        name: decryptFUNCTION(patient.name),
        email: decryptFUNCTION(patient.email),
        ph: decryptFUNCTION(patient.ph),
        dob: decryptFUNCTION(patient.dob),
        gender: decryptFUNCTION(patient.gender),
        depertment: decryptFUNCTION(patient.department),
        state: decryptFUNCTION(patient.address.state),
        city: decryptFUNCTION(patient.address.city),
        vill_or_town: decryptFUNCTION(patient.address.vill_or_town),
      };
    });
    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      patients: decryptedPatients,// Changed "user" to "users" to be consistent with array naming
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
