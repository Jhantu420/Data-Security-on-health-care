const express = require("express");
const {
  submitdata,
  login,
  patientgeninformation_data_fetch,
  patientgeninformation_data_fetch_bynurse,
  patientgeninformation_data_fetch_2ndtabelby_doctor,
  patientgeninformation_data_fetch_2ndtabelby_Nurse,
  patientgeninformation_data_fetch_3ndtabelby_doctor,
  patientgeninformation_data_fetch_3ndtabelby_nurse,
  updatesymtomreport,
  updateMedicineDiseaseReport,
  dischargePatient,
} = require("../controllers/doctors");
const { submitdataa, nurselogin } = require("../controllers/Nurse");
const router = express.Router();

router.post("/register", submitdata);
router.post("/nurseregister", submitdataa);
router.post("/loginnurse", nurselogin);
router.post("/logindoctor", login);

router.post("/PatientData", patientgeninformation_data_fetch);

router.post("/nurse_pateint_fetch", patientgeninformation_data_fetch_bynurse);
router.post(
  "/PatientData2ndtabel",
  patientgeninformation_data_fetch_2ndtabelby_doctor
);

router.post(
  "/nursefetchpatient2ndtabel",
  patientgeninformation_data_fetch_2ndtabelby_Nurse
);

router.post(
  "/docotr_patient_3rdtabel",
  patientgeninformation_data_fetch_3ndtabelby_doctor
);
router.post(
  "/nursefetch3rdtabel",
  patientgeninformation_data_fetch_3ndtabelby_nurse
);

router.put("/update2ndtabel", updateMedicineDiseaseReport);

router.put("/update3rdtabel", updatesymtomreport);

router.post("/deschargepatient", dischargePatient);

module.exports = router;
