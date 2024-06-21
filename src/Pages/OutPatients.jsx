import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import supabase from '../Services/Supabase';

const OutPatients = () => {
  const [outPatients, setOutPatients] = useState([]);

  useEffect(() => {
    fetchOutPatients();
  }, []);

  async function fetchOutPatients() {
    try {
      const { data, error } = await supabase
        .from('out_patient')
        .select('*');
      
      if (error) {
        console.error('Error fetching out-patients:', error);
      } else {
        setOutPatients(data);
      }
    } catch (error) {
      console.error('Error fetching out-patients:', error.message);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', ml: '60px' }}>
      <Box sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Patient Number</th>
              <th>Appointment Number</th>
            </tr>
          </thead>
          <tbody>
            {outPatients.map((patient) => (
              <tr key={patient.patient_num}>
                <td>{patient.patient_num}</td>
                <td>{patient.appointment_num}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}

export default OutPatients;
