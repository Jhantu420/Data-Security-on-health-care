const express = require("express");

const { submitdata, login, logout } = require("../controllers/gen_info");

const {
  submitMedicineDiseaseReport,
  retrivefromthe2ndtabel,
} = require("../controllers/medicine_&_disease");

const {
  submitSymptomPathologyReport,
  sympt,
} = require("../controllers/symptom_pathology_report");

const router = express.Router();

// Endpoint for submitting a symptom pathology report
router.post("/sppr", submitSymptomPathologyReport);

// Endpoint for submitting a medicine and disease report
router.post("/mdr", submitMedicineDiseaseReport);

// Your existing endpoints
router.post("/submit", submitdata);
router.post("/login", login);
router.post("/mdrretrive", retrivefromthe2ndtabel);
router.post("/sympt", sympt);
router.post("/logout", logout);

module.exports = router;
