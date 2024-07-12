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

const NurseDashboard = () => {
  const [data, setData] = useState({
    encryptedIds: [],
    patientDetails: [],
  });
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState({});
  const [details, setDetails] = useState({});
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
            `http://localhost:4000/api/v1/nurse_get_his_allocate_patient_id/${customId}`
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

      const url = `http://localhost:4000/api/v1/patientdata_by_nurse?encryptedCustomId=${encryptedId}`;
      console.log("Request URL:", url);

      const response = await axios.post(
        url,
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
        "http://localhost:4000/api/v1/nurseacessmedicnetabel",
        { encryptedCustomId: encryptedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const medicineData = response.data.medicinetabeldata;
      console.log("Medicine data:", medicineData);

      setDetails((prevDetails) => ({
        ...prevDetails,
        [encryptedId]: {
          ...prevDetails[encryptedId],
          medicine: medicineData,
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

  // const fetchReportDetails = async (encryptedId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.error("Access token is missing");
  //       return;
  //     }

  //     const response = await axios.post(
  //       "http://localhost:4000/api/v1/reportabeldata",
  //       { encryptedCustomId: encryptedId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setDetails((prevDetails) => ({
  //       ...prevDetails,
  //       [encryptedId]: {
  //         ...prevDetails[encryptedId],
  //         report: response.data.reportabeldata,
  //       },
  //     }));
  //     setSelectedEncryptedId(encryptedId);
  //     setShowDetails((prevShowDetails) => ({
  //       ...prevShowDetails,
  //       [encryptedId]: {
  //         ...prevShowDetails[encryptedId],
  //         showReport: true,
  //       },
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching report details:", error);
  //   }
  // };
  // const handleReportUpdateClick = (reportData) => {
  //   setSelectedReportData(reportData);
  //   setShowReportUpdateForm(true);
  // };
  // const handleCloseUpdateForm = () => {
  //   setShowReportUpdateForm(false);
  // };
  // const handleUpdateReportData = (updatedReportData) => {
  //   setDetails((prevDetails) => ({
  //     ...prevDetails,
  //     [selectedEncryptedId]: {
  //       ...prevDetails[selectedEncryptedId],
  //       report: updatedReportData,
  //     },
  //   }));
  // };
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
                <th>Encrypted Id</th>
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
                    {showDetails[encryptedId]?.showMedicine ? (
                      details[encryptedId]?.medicine && (
                        <div>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Description:
                            </b>{" "}
                            {details[encryptedId].medicine.Description || "N/A"}
                          </p>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Disease Details:
                            </b>{" "}
                            {details[encryptedId].medicine.DiseaseDetails ||
                              "N/A"}
                          </p>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Name Of Medicine:
                            </b>{" "}
                            {details[encryptedId].medicine.NameOfMedicine ||
                              "N/A"}
                          </p>
                          <p>
                            <b
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Usage Instructions:
                            </b>{" "}
                            {details[encryptedId].medicine.UsageInstructions ||
                              "N/A"}
                          </p>
                        </div>
                      )
                    ) : (
                      <button
                        className="show-details-button"
                        onClick={() => {
                          console.log(
                            "Show Details button clicked for encryptedId:",
                            encryptedId
                          );
                          fetchMedicineDetails(encryptedId);
                        }}
                      >
                        Show Details
                      </button>
                    )}
                  </td>
                  <td>Hii</td> {/* Placeholder for Report Details */}
                  <td>{encryptedId.encryptedId}</td> {/* Display encrypted ID here */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default NurseDashboard;
