const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/gen_info");
const doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const crypto = require("crypto");

// Function to encrypt the customId
const encryptCustomId = (customId) => {
  const algorithm = "aes-256-cbc";
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(customId, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return {
    encryptedCustomId: `${encrypted}:${iv.toString("hex")}:${key.toString(
      "hex"
    )}`,
  };
};

// Function to decrypt the encryptedCustomId


exports.submitdata = async (req, res, next) => {
  try {
    const { name, email, ph, address, dob, gender, password, department } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Find doctors and nurses with limit less than or equal to 10
    const doctors = await doctor.find({
      department,
      limit: { $lte: 10 },
    });

    const nurses = await Nurse.find({
      department,
      limit: { $lte: 10 },
    });

    // Find the doctor and nurse with the minimum limit
    const minDoctor =
      doctors.length > 0
        ? doctors.reduce((min, doctor) =>
            doctor.limit < min.limit ? doctor : min
          )
        : null;

    const minNurse =
      nurses.length > 0
        ? nurses.reduce((min, nurse) => (nurse.limit < min.limit ? nurse : min))
        : null;

    // Increase the limit of the doctor and nurse by 1
    if (minDoctor) {
      minDoctor.limit += 1;
      await minDoctor.save();
    }

    if (minNurse) {
      minNurse.limit += 1;
      await minNurse.save();
    }

    // Combine the customIds and encrypt
    const { encryptedCustomId } = encryptCustomId(
      `${minDoctor ? minDoctor.customId : ""}_${
        minNurse ? minNurse.customId : ""
      }`
    );

    const user = new User({
      name,
      email,
      ph,
      address,
      dob,
      gender,
      password: hashedPassword,
      department,
      encryptedCustomId,
    });

    await user.validate();
    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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

    // Decrypt the encryptedCustomId
    const decryptedCustomId = decryptCustomId(user.encryptedCustomId);

    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "15d",
    });

    res.status(200).json({
      success: true,
      token,
      user: { ...user.toObject(), decryptedCustomId }, // Include decryptedCustomId in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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
