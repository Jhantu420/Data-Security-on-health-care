import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { RingLoader } from "react-spinners";
import "../CSS/dashboard.css";

const DashboardCard = ({ title, amount, icon: Icon }) => (
  <div className="dashboard-card">
    <div className="card-content">
      <div className="icon-container">
        <div className="icon-bg">
          <Icon size={32} />
        </div>
      </div>
      <div className="text-content">
        <h5 className="title">{title}</h5>
        <h3 className="amount">
          {amount}{" "}
          <span className="exchange-icon">
            <i className="fas fa-exchange-alt"></i>
          </span>
        </h3>
      </div>
    </div>
  </div>
);

const UpdateForm = ({
  encryptedCustomId,
  onClose,
  onUpdateMedicineData,
  currentData,
}) => {
  const [updateData, setUpdateData] = useState(currentData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      await axios.put(
        "http://localhost:4000/api/v1/updatemedicinetabel",
        {
          encryptedCustomId,
          updateData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
      onUpdateMedicineData(updateData);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="update-form-overlay">
      <div className="update-form">
        <form onSubmit={handleSubmit}>
          <label>Description:</label>
          <input
            type="text"
            name="Description"
            value={updateData.Description}
            onChange={handleChange}
            required
          />
          <label>Disease Details:</label>
          <input
            type="text"
            name="DiseaseDetails"
            value={updateData.DiseaseDetails}
            onChange={handleChange}
            required
          />
          <label>Name of Medicine:</label>
          <input
            type="text"
            name="NameOfMedicine"
            value={updateData.NameOfMedicine}
            onChange={handleChange}
            required
          />
          <label>Usage Instructions:</label>
          <input
            type="text"
            name="UsageInstructions"
            value={updateData.UsageInstructions}
            onChange={handleChange}
            required
          />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [searchName, setSearchName] = useState("");
  const [encryptedIds, setEncryptedIds] = useState([]);
  const [patientDetails, setPatientDetails] = useState([]);
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedEncryptedId, setSelectedEncryptedId] = useState("");
  const [selectedMedicineData, setSelectedMedicineData] = useState({});
  const [reportDetails, setReportDetails] = useState([]);
  const [selectedReportData, setSelectedReportData] = useState({});



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const customId = decodedToken.customId;
          const response = await axios.get(
            `http://localhost:4000/api/v1/doctor_get_his_allocate_patient_id/${customId}`
          );
          setEncryptedIds(response.data.encryptedIds);

          const patientData = await Promise.all(
            response.data.encryptedIds.map(async (encryptedId) => {
              const patient = await fetchPatientData(encryptedId.encryptedId);
              return patient;
            })
          );

          setPatientDetails(patientData);

          const medicineData = await Promise.all(
            response.data.encryptedIds.map(async (encryptedId) => {
              const medicine = await fetchMedicineData(encryptedId.encryptedId);
              return medicine;
            })
          );
          setMedicineDetails(medicineData);
          const reportData = await Promise.all(
            response.data.encryptedIds.map(async (encryptedId) => {
              const report = await fetchReportData(encryptedId.encryptedId);
              return report;
            })
          );
          setReportDetails(reportData);
          setLoading(false); // Set loading to false after data fetching is complete
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Ensure loading state is updated even in case of errors
      }
    };

    fetchData();
  }, []);

  const fetchPatientData = async (encryptedId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      const response = await axios.post(
        "http://localhost:4000/api/v1/patient_data",
        { encryptedCustomId: encryptedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.patients[0];
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchMedicineData = async (encryptedId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      const response = await axios.post(
        "http://localhost:4000/api/v1/medicinetabelbydoctor",
        { encryptedCustomId: encryptedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.medicinetabeldata;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchReportData = async (encryptedId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      const response = await axios.post(
        "http://localhost:4000/api/v1/reportabeldata",
        { encryptedCustomId: encryptedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data)
    } catch (error) {}
  };
  const handleUpdateClick = (encryptedId, medicineData) => {
    setSelectedEncryptedId(encryptedId);
    setSelectedMedicineData(medicineData);
    setShowUpdateForm(true);
  };
  const handleUpdateReportClick = (encryptedId, ReportData) => {
    setSelectedEncryptedId(encryptedId);
    setSelectedReportData(ReportData);
    setShowUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
  };

  const handleUpdateMedicineData = (updatedData) => {
    const index = encryptedIds.findIndex(
      (item) => item.encryptedId === selectedEncryptedId
    );
    const updatedMedicineDetails = [...medicineDetails];
    updatedMedicineDetails[index] = updatedData;
    setMedicineDetails(updatedMedicineDetails);
  };
  const handleUpdateReportData = (updatedData) => {
    const index = encryptedIds.findIndex(
      (item) => item.encryptedId === selectedEncryptedId
    );
    const updatedReportDetails = [...reportDetails];
    updatedReportDetails[index] = updatedData;
    setReportDetails(updatedReportDetails);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <RingLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>
    );
  }

  return (
    <div className="healthcare-dashboard">
      <div className="dashboard-title">Health Care Dashboard</div>
      <div className="dashboard-cards">
        <DashboardCard
          title="Patients"
          amount={encryptedIds.length}
          icon={Users}
        />
      </div>
      <div className="crud-container">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search Patient"
            className="input input-bordered w-full mr-2"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="crud-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Patient Email</th>
                <th>Encrypted Id</th>
                <th>View Symptom & Pathology report / Update</th>
                <th>View Medicine & Disease report</th>
              </tr>
            </thead>
            <tbody>
              {encryptedIds.map((encryptedId, index) => (
                <tr key={index}>
                  <td>
                    {patientDetails[index] ? patientDetails[index].name : "N/A"}
                  </td>
                  <td>
                    {patientDetails[index] && (
                      <div>
                        <p>ph: {patientDetails[index].ph}</p>
                        <p>email: {patientDetails[index].email}</p>
                      </div>
                    )}
                  </td>
                  <td className="truncate">{encryptedId.encryptedId}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleUpdateClick(
                          encryptedId.encryptedId,
                          medicineDetails[index]
                        )
                      }
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    {medicineDetails[index] && (
                      <div>
                        <p>
                          <b>Description</b>:{" "}
                          {medicineDetails[index].Description}
                        </p>
                        <p>
                          <b>DiseaseDetails</b>:{" "}
                          {medicineDetails[index].DiseaseDetails}
                        </p>
                        <p>
                          <b>NameOfMedicine</b>:{" "}
                          {medicineDetails[index].NameOfMedicine}
                        </p>
                        <p>
                          <b>UsageInstructions</b>:{" "}
                          {medicineDetails[index].UsageInstructions}
                        </p>
                        <button
                          onClick={() =>
                            handleUpdateClick(
                              encryptedId.encryptedId,
                              medicineDetails[index]
                            )
                          }
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showUpdateForm && (
        <UpdateForm
          encryptedCustomId={selectedEncryptedId}
          onClose={handleCloseUpdateForm}
          onUpdateMedicineData={handleUpdateMedicineData}
          currentData={selectedMedicineData}
          currentData={selectedReportData}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
