const User = require("../models/gen_info");
const SymptomPathologyReport = require("../models/symptom_pathology_report");
const crypto = require("crypto");

exports.submitSymptomPathologyReport = async (req, res, next) => {
  try {
    const { userId, symptoms, reportText } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const symptomPathologyReport = new SymptomPathologyReport({
      patientId: userId,
      symptoms,
      reportText,
    });

    await symptomPathologyReport.validate();
    await symptomPathologyReport.save();

    res.status(201).json({
      success: true,
      symptomPathologyReport,
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

exports.sympt = async (req, res, next) => {
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
