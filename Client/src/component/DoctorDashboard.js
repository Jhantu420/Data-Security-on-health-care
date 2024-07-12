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

const UpdateMedicineForm = ({
  encryptedCustomId,
  onClose,
  onUpdateMedicineData,
  currentData,
}) => {
  const [updateMedicineData, setUpdateMedicineData] = useState(currentData);

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    setUpdateMedicineData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMedicineSubmit = async (e) => {
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
          updateData: updateMedicineData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onClose();
      onUpdateMedicineData(updateMedicineData);
    } catch (error) {
      console.error("Error updating medicine data:", error);
    }
  };

  return (
    <div className="update-form-overlay" onClick={onClose}>
      <div className="update-form" onClick={(e) => e.stopPropagation()}>
        <div className="uh1"><h1>Update Patient Medicine and Disease Details</h1></div>
        <form onSubmit={handleMedicineSubmit}>
          <label>Description:</label>
          <input
            type="text"
            name="Description"
            value={updateMedicineData.Description}
            onChange={handleMedicineChange}
            required
          />
          <label>Disease Details:</label>
          <input
            type="text"
            name="DiseaseDetails"
            value={updateMedicineData.DiseaseDetails}
            onChange={handleMedicineChange}
            required
          />
          <label>Name of Medicine:</label>
          <input
            type="text"
            name="NameOfMedicine"
            value={updateMedicineData.NameOfMedicine}
            onChange={handleMedicineChange}
            required
          />
          <label>Usage Instructions:</label>
          <input
            type="text"
            name="UsageInstructions"
            value={updateMedicineData.UsageInstructions}
            onChange={handleMedicineChange}
            required
          />
          <button type="submit">Update Medicine</button>
        </form>
      </div>
    </div>
  );
};

const UpdateReportForm = ({
  encryptedCustomId,
  onClose,
  onUpdateReportData,
  Sec_currentData,
}) => {
  const [updateReportData, setUpdateReportData] = useState(Sec_currentData);

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setUpdateReportData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      await axios.put(
        "http://localhost:4000/api/v1/updatereporttable",
        {
          encryptedCustomId,
          updateData: updateReportData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onClose();
      onUpdateReportData(updateReportData);
    } catch (error) {
      console.error("Error updating report data:", error);
    }
  };

  return (
    <div className="update-form-overlay" onClick={onClose}>
      <div className="update-form" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleReportSubmit}>
          <label>Symptom:</label>
          <input
            type="text"
            name="symptoms"
            value={updateReportData.symptoms}
            onChange={handleReportChange}
            required
          />
          <label>Pathology Report:</label>
          <input
            type="text"
            name="reportText"
            value={updateReportData.reportText}
            onChange={handleReportChange}
            required
          />
          <button type="submit">Update Report</button>
        </form>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [data, setData] = useState({
    encryptedIds: [],
    patientDetails: [],
  });
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState({});
  const [details, setDetails] = useState({});
  const [showMedicineUpdateForm, setShowMedicineUpdateForm] = useState(false);
  const [showReportUpdateForm, setShowReportUpdateForm] = useState(false);
  const [selectedEncryptedId, setSelectedEncryptedId] = useState("");
  const [selectedMedicineData, setSelectedMedicineData] = useState({});
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
          const encryptedIds = response.data.encryptedIds;

          const patientDataPromise = encryptedIds.map((id) =>
            fetchPatientData(id.encryptedId)
          );

          const patientDetails = await Promise.all(patientDataPromise);

          setData({
            encryptedIds,
            patientDetails,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
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

  const fetchMedicineDetails = async (encryptedId) => {
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

      setDetails((prevDetails) => ({
        ...prevDetails,
        [encryptedId]: {
          ...prevDetails[encryptedId],
          medicine: response.data.medicinetabeldata,
        },
      }));
      setSelectedEncryptedId(encryptedId);
      setShowDetails((prevShowDetails) => ({
        ...prevShowDetails,
        [encryptedId]: {
          ...prevShowDetails[encryptedId],
          showMedicine: true,
        },
      }));
    } catch (error) {
      console.error("Error fetching medicine details:", error);
    }
  };

  const fetchReportDetails = async (encryptedId) => {
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

      setDetails((prevDetails) => ({
        ...prevDetails,
        [encryptedId]: {
          ...prevDetails[encryptedId],
          report: response.data.reportabeldata,
        },
      }));
      setSelectedEncryptedId(encryptedId);
      setShowDetails((prevShowDetails) => ({
        ...prevShowDetails,
        [encryptedId]: {
          ...prevShowDetails[encryptedId],
          showReport: true,
        },
      }));
    } catch (error) {
      console.error("Error fetching report details:", error);
    }
  };

  const handleMedicineUpdateClick = (medicineData) => {
    setSelectedMedicineData(medicineData);
    setShowMedicineUpdateForm(true);
  };

  const handleReportUpdateClick = (reportData) => {
    setSelectedReportData(reportData);
    setShowReportUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setShowMedicineUpdateForm(false);
    setShowReportUpdateForm(false);
  };

  const handleUpdateMedicineData = (updatedMedicineData) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [selectedEncryptedId]: {
        ...prevDetails[selectedEncryptedId],
        medicine: updatedMedicineData,
      },
    }));
  };

  const handleUpdateReportData = (updatedReportData) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [selectedEncryptedId]: {
        ...prevDetails[selectedEncryptedId],
        report: updatedReportData,
      },
    }));
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
      <div className="dashboard-title">Doctor Dashboard</div>
      <div className="dashboard-cards">
        <DashboardCard
          title="Patients"
          amount={data.encryptedIds.length}
          icon={Users}
        />
      </div>
      <div className="crud-container">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Medicine Details</th>
                <th>Report Details</th>
              </tr>
            </thead>
            <tbody>
              {data.encryptedIds.map((encryptedId, index) => (
                <tr key={index}>
                  <td>
                    {data.patientDetails[index] && (
                      <div>
                        <p>
                          <b style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            Name:
                          </b>
                          {data.patientDetails[index].name}
                        </p>
                        <p>
                          <b style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            Phone no:
                          </b>
                          {data.patientDetails[index].ph}
                        </p>
                        <p>
                          <b style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            Email:
                          </b>
                          {data.patientDetails[index].email}
                        </p>
                      </div>
                    )}
                  </td>

                  <td>
                    {showDetails[encryptedId.encryptedId]?.showMedicine ? (
                      details[encryptedId.encryptedId]?.medicine && (
                        <div>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Description:
                            </b>{" "}
                            {details[encryptedId.encryptedId].medicine
                              .Description || "N/A"}
                          </p>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Disease Details:
                            </b>{" "}
                            {details[encryptedId.encryptedId].medicine
                              .DiseaseDetails || "N/A"}
                          </p>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Name Of Medicine:
                            </b>{" "}
                            {details[encryptedId.encryptedId].medicine
                              .NameOfMedicine || "N/A"}
                          </p>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Usage Instructions:
                            </b>{" "}
                            {details[encryptedId.encryptedId].medicine
                              .UsageInstructions || "N/A"}
                          </p>
                          <button
                            className="update-button"
                            onClick={() =>
                              handleMedicineUpdateClick(
                                details[encryptedId.encryptedId].medicine
                              )
                            }
                          >
                            Update Medicine
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        className="show-details-button"
                        onClick={() =>
                          fetchMedicineDetails(encryptedId.encryptedId)
                        }
                      >
                        Show Details
                      </button>
                    )}
                  </td>

                  <td>
                    {showDetails[encryptedId.encryptedId]?.showReport ? (
                      details[encryptedId.encryptedId]?.report && (
                        <div>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Symptom:
                            </b>{" "}
                            {details[encryptedId.encryptedId].report.symptoms ||
                              "N/A"}
                          </p>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Pathology Report:
                            </b>{" "}
                            {details[encryptedId.encryptedId].report
                              .reportText || "N/A"}
                          </p>
                          <button
                          className="update-button"
                            onClick={() =>
                              handleReportUpdateClick(
                                details[encryptedId.encryptedId].report
                              )
                            }
                          >
                            Update Report
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        className="show-details-button"
                        onClick={() =>
                          fetchReportDetails(encryptedId.encryptedId)
                        }
                      >
                        Show Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showMedicineUpdateForm && (
        <UpdateMedicineForm
          encryptedCustomId={selectedEncryptedId}
          onClose={handleCloseUpdateForm}
          onUpdateMedicineData={handleUpdateMedicineData}
          currentData={selectedMedicineData}
        />
      )}
      {showReportUpdateForm && (
        <UpdateReportForm
          encryptedCustomId={selectedEncryptedId}
          onClose={handleCloseUpdateForm}
          onUpdateReportData={handleUpdateReportData}
          Sec_currentData={selectedReportData}
        />
      )}
      
    </div>
  );
};

export default DoctorDashboard;


