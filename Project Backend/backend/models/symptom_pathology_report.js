const mongoose = require("mongoose");
const crypto = require("crypto");
const GENPatient = require("../models/gen_info");

const patientSymptomPathologySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  second_encryptedCustomId: {
    type: String,
    required: false,
  },
  symptoms: {
    type: String,
    required: true,
  },
  dateOfSymptom: {
    type: Date,
    default: Date.now,
  },
  reportText: {
    type: String,
    required: true,
  },
  dateOfReport: {
    type: Date,
    default: Date.now,
  },
});

patientSymptomPathologySchema.pre("save", async function (next) {
  try {
    const patient = await GENPatient.findById(this.patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const customIdss = patient.encryptedCustomId;

    const hash = crypto.createHash("sha512");
    const hashedCustomId = hash.update(customIdss, "utf8").digest("hex");

    this.second_encryptedCustomId = hashedCustomId;

    next();
  } catch (error) {
    next(error);
  }
});

const PatientSymptomPathologyReport = mongoose.model(
  "PatientSymptomPathologyReport",
  patientSymptomPathologySchema
);

module.exports = PatientSymptomPathologyReport;
