import React, { useState, useEffect } from 'react';
import supabase from '../Services/Supabase';

const NextOfKin = ({ patientNum }) => {
  const [kinDetails, setKinDetails] = useState([]);

  useEffect(() => {
    fetchKinDetails();
  }, [patientNum]);

  async function fetchKinDetails() {
    try {
      const { data, error } = await supabase
        .from('next_of_kin')
        .select('*')
        .eq('patient_num', patientNum); 

      if (error) {
        console.error('Error fetching next of kin details:', error);
      } else {
        setKinDetails(data);
      }
    } catch (error) {
      console.error('Error fetching next of kin details:', error.message);
    }
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Relationship to Patient</th>
          <th>Address</th>
          <th>Telephone Number</th>
          <th>Patient Number</th>
        </tr>
      </thead>
      <tbody>
        {kinDetails.map((kin) => (
          <tr key={kin.tel_number}>
            <td>{kin.full_name}</td>
            <td>{kin.relationship_to_the_patient}</td>
            <td>{kin.address}</td>
            <td>{kin.tel_number}</td>
            <td>{kin.patient_num}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NextOfKin;
