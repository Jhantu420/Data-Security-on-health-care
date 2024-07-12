// PatientDetails.js
import React from 'react';

const PatientDetails = ({ patient }) => (
  <div>
    <p>
      <b style={{ fontWeight: "bold", fontSize: "1.1em" }}>Name:</b> {patient.name}
    </p>
    <p>
      <b style={{ fontWeight: "bold", fontSize: "1.1em" }}>Phone no:</b> {patient.ph}
    </p>
    <p>
      <b style={{ fontWeight: "bold", fontSize: "1.1em" }}>Email:</b> {patient.email}
    </p>
  </div>
);

export default PatientDetails;
