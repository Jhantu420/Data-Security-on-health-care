import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DoctorDash.css";


function SuperAdmin() {
  const [dataPreUserCount, setDataPreUserCount] = useState(null);
  const [reportUserCount, setReportUserCount] = useState(null);
  const [trainingUserCount, setTrainingUserCount] = useState(null);
  const [testingUserCount, setTestingUserCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a 4-second delay before fetching data
        setTimeout(async () => {
          const dataPreResponse = await axios.get("http://localhost:3001/");
          const reportResponse = await axios.get("http://localhost:3001/");
          const trainingResponse = await axios.get("http://localhost:3001/");
          const testingResponse = await axios.get("http://localhost:3001/");

          setDataPreUserCount(dataPreResponse.data.length);
          setReportUserCount(reportResponse.data.length);
          setTrainingUserCount(trainingResponse.data.length);
          setTestingUserCount(testingResponse.data.length);
          setLoading(false);
        }, 4000); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="DoctorDash">
      <h2 className="heading"> Doctor Appoinment</h2>
      <div className="MainCards">
        <div className="card">
          <img id="datapre" src={""} alt="" />
          <h2>Cardiologist</h2>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <p>{dataPreUserCount}</p>
          )}<h6><b></b></h6>
        </div>
        
        <div className="card">
          <img id="report" className="admin_img" src={""} alt="" />
          <h2>General Physician</h2>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <p>{reportUserCount}</p>
          )}<h6><b></b></h6>
        </div>
        <div className="card">
          <img id="training" src={""} alt="" />
          <h2>EyeSpacialist</h2>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <p>{trainingUserCount}</p>
          )}<h6><b></b></h6>
        </div>
        
        <div className="card">
          <img id="testing" src={""} alt="" />
          <h2>EyeSpacialist</h2>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <p>{testingUserCount}</p>
          )}<h6><b></b></h6>
        </div>
        
      </div>
    </div>
  );
}

export default SuperAdmin;
