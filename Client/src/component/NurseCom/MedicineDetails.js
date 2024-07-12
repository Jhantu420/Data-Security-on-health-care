// MedicineDetails.js
import React from 'react';

const MedicineDetails = ({ medicine }) => (
  <div>
    {medicine && medicine.map((med, index) => (
      <p key={index}>
        <b>Medicine Name:</b> {med.medicine_name}, <b>Dosage:</b> {med.dosage}
      </p>
    ))}
  </div>
);

export default MedicineDetails;
