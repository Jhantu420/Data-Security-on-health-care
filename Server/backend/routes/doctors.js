const express = require("express");
const {
  submitdata,
  login,
  getAllEncryptedIds,
  getProfile,
  medicineTbel,
  symptreportneTbel,
  medicineTbel_nurse,
  updateProfile,
  updatethemedicineTbel,
  updatethesymptomsTbele,
  deleteProfilesbythedoctor,
  getuserprofile_patient,
} = require("../controllers/doctors");

const authenticateToken = require("../middleware/AuthDoctor");
const authenticateTokens = require("../middleware/AuthNurse");

const {
  submitdataa,
  nurselogin,
  getAllEncryptedId,
  getProfiles,
  updatethesymptomsTbeles,
  updateProfiles,
  deleteProfilesbythenurse,
  getuserprofile_patient_by_nurse,
} = require("../controllers/Nurse");
const router = express.Router();

router.post("/register", submitdata);
router.post("/nurseregister", submitdataa);
router.post("/loginnurse", nurselogin);
router.post("/logindoctor", login);
router.get("/doctor_get_his_allocate_patient_id/:customId", getAllEncryptedIds);
router.get("/nurse_get_his_allocate_patient_id/:customId", getAllEncryptedId);
router.get("/mee", authenticateToken, getProfile);
router.get("/meee", authenticateTokens, getProfiles);
router.post("/medicinetabelbydoctor", authenticateToken, medicineTbel); // Doctor Medicine and disease

router.post("/reportabeldata", authenticateToken, symptreportneTbel); // Doctor Symptom and report
router.post("/nurseacessmedicnetabel", authenticateTokens, medicineTbel); //// Nurse Medicine and disease
router.post("/symptable", authenticateTokens, symptreportneTbel); // Nurse Symptom and Pathology report table
router.put("/profile", authenticateToken, updateProfile);
router.put("/nurseprofile", authenticateTokens, updateProfiles);
router.put("/updatemedicinetabel", authenticateToken, updatethemedicineTbel); // doctor update medicine table
router.put("/updatereporttable", authenticateToken, updatethesymptomsTbele); // dotor update report table
router.put(
  "/update3rdtablebynurse",
  authenticateTokens,
  updatethesymptomsTbeles
);  // nurse update Symptom and pathology report table
router.delete("/deleteProfiles", authenticateToken, deleteProfilesbythedoctor);

router.delete(
  "/deleteprofilebynurse",
  authenticateTokens,
  deleteProfilesbythenurse
);

router.post("/patient_data", authenticateToken, getuserprofile_patient);

router.post(
  "/patientdata_by_nurse",
  authenticateTokens,
  getuserprofile_patient_by_nurse
);
module.exports = router;
