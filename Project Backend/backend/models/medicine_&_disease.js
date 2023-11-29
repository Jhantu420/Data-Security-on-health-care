const mongoose = require("mongoose");
const crypto = require("crypto");
const GENPatient = require("../models/gen_info");

const patientMedicineDiseaseSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  super_encryptedCustomId: {
    type: String,
    required: false,
  },
  DiseaseDetails: {
    type: [String],
    required: true,
  },
  NameOfMedicine: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  UsageInstructions: {
    type: String,
    required: true,
  },
});


patientMedicineDiseaseSchema.pre("save", async function (next) {
  try {
    const patient = await GENPatient.findById(this.patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const customIds = patient.encryptedCustomId;

    const hash = crypto.createHash("sha256");
    const hashedCustomId = hash.update(customIds, "utf8").digest("hex");

    this.super_encryptedCustomId = hashedCustomId;

    next();
  } catch (error) {
    next(error);
  }
});
const PatientMedicineDiseaseReport = mongoose.model(
  "PatientMedicineDiseaseReport",
  patientMedicineDiseaseSchema
);

module.exports = PatientMedicineDiseaseReport;
