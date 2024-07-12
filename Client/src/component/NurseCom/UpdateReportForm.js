// UpdateReportForm.js
import React, { useState } from 'react';
import axios from 'axios';

const UpdateReportForm = ({ encryptedCustomId, onClose, onUpdateReportData, Sec_currentData }) => {
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

export default UpdateReportForm;
