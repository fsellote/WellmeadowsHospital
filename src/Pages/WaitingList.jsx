import React, { useEffect, useState } from 'react';
import supabase from '../Services/Supabase';
import { Button, Box, Container, Dialog, DialogContent, DialogActions } from '@mui/material';
import PatientRegistrationForm from './PatientRegistrationForm'; // Adjust the import based on your file structure

const WaitingList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    fetchWaitingList();
  }, []);

  async function fetchWaitingList() {
    try {
      const { data, error } = await supabase
        .from('waiting_list')
        .select('*');

      if (error) {
        console.error('Error fetching waiting list:', error.message);
        return;
      }

      setWaitingList(data);
    } catch (error) {
      console.error('Error fetching waiting list:', error.message);
    }
  }

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleMoveToInPatients = async () => {
    if (!selectedPatient) return;

    try {
      const { error: insertError } = await supabase
        .from('in_patient')
        .insert({
          appointment_num: selectedPatient.appointment_num,
          // Add other necessary fields here
        });

      if (insertError) {
        console.error('Error inserting into in-patients:', insertError.message);
        return;
      }

      const { error: deleteError } = await supabase
        .from('waiting_list')
        .delete()
        .eq('appointment_num', selectedPatient.appointment_num);

      if (deleteError) {
        console.error('Error deleting from waiting list:', deleteError.message);
        return;
      }

      setWaitingList(prevList => prevList.filter(item => item.appointment_num !== selectedPatient.appointment_num));
      setSelectedPatient({
        f_first_name: selectedPatient.first_name,
        f_last_name: selectedPatient.last_name,
        f_address: selectedPatient.address,
        f_sex: selectedPatient.sex,
        f_tel_no: selectedPatient.tel_no,
        f_marital_status: selectedPatient.marital_status,
        f_dob: selectedPatient.dob,
        f_date_registered: new Date().toISOString().split('T')[0],
        f_nok_fullname: selectedPatient.nok_fullname,
        f_relationship: selectedPatient.relationship,
        f_nok_address: selectedPatient.nok_address,
        f_nok_tel_no: selectedPatient.nok_tel_no,
        f_clinic_num: selectedPatient.clinic_num
      });
      setShowRegistrationForm(true);
    } catch (error) {
      console.error('Error moving patient to in-patients:', error.message);
    }
  };

  const handleCloseForm = () => {
    setShowRegistrationForm(false);
    setSelectedPatient(null);
  };

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleMoveToInPatients}
          disabled={!selectedPatient}
        >
          Move to In-Patients
        </Button>
      </Box>
      {!showRegistrationForm ? (
        <Box>
          <table className="table">
            <thead>
              <tr>
                <th>Appointment Number</th>
                <th>Date Placed</th>
                <th>Ward Id</th>
              </tr>
            </thead>
            <tbody>
              {waitingList.map((patient) => (
                <tr
                  key={patient.appointment_num}
                  onClick={() => handleRowClick(patient)}
                  style={{
                    backgroundColor: selectedPatient?.appointment_num === patient.appointment_num ? '#f0f0f0' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <td>{patient.appointment_num}</td>
                  <td>{patient.date_placed}</td>
                  <td>{patient.ward_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      ) : (
        <Dialog open={showRegistrationForm} onClose={handleCloseForm} fullWidth maxWidth="lg">
          <DialogContent>
            <PatientRegistrationForm prefillData={selectedPatient} onClose={handleCloseForm} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default WaitingList;