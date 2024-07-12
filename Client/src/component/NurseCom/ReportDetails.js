// ReportDetails.js
import React from 'react';

const ReportDetails = ({ report, onUpdateClick }) => (
  <div>
    {report && report.map((rep, index) => (
      <div key={index}>
        <p><b>Symptom:</b> {rep.symptoms}</p>
        <p><b>Pathology Report:</b> {rep.reportText}</p>
        <button onClick={() => onUpdateClick(rep)}>Update</button>
      </div>
    ))}
  </div>
);

export default ReportDetails;
