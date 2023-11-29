const User = require("../models/gen_info");
const MedicineDiseaseReport = require("../models/medicine_&_disease");
const crypto = require("crypto");

exports.submitMedicineDiseaseReport = async (req, res, next) => {
  try {
    const {
      userId,
      DiseaseDetails,
      NameOfMedicine,
      Description,
      UsageInstructions,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const medicineDiseaseReport = new MedicineDiseaseReport({
      patientId: userId,
      DiseaseDetails,
      NameOfMedicine,
      Description,
      UsageInstructions,
    });

    await medicineDiseaseReport.validate();
    await medicineDiseaseReport.save();

    res.status(201).json({
      success: true,
      medicineDiseaseReport,
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

// Data retrive by the patient for the 2nd Tabel

exports.retrivefromthe2ndtabel = async (req, res, next) => {
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

    // If iscustomid matches, return the data
    res.status(200).json({
      success: true,
      message: "Data Has Been retrieved Successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
