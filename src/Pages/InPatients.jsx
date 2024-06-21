import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import supabase from '../Services/Supabase';

const InPatients = () => {
  const [inPatients, setInPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_num: '',
    appointment_num: '',
    bed_num: '',
    duration_of_stay: '',
    date_leave: '',
    actual_leave: '',
    ward_id: ''
  });

  useEffect(() => {
    fetchInPatients();
  }, []);

  async function fetchInPatients() {
    try {
      const { data, error } = await supabase
        .from('in_patient')
        .select('*');
      
      if (error) {
        console.error('Error fetching in-patients:', error);
      } else {
        setInPatients(data);
      }
    } catch (error) {
      console.error('Error fetching in-patients:', error.message);
    }
  }

  const handleClickOpen = (patient) => {
    setSelectedPatient(patient);
    setFormData(patient);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('in_patient')
        .update(formData)
        .eq('patient_num', selectedPatient.patient_num);
      
      if (error) {
        console.error('Error updating in-patient:', error);
      } else {
        fetchInPatients(); 
        handleClose();
      }
    } catch (error) {
      console.error('Error updating in-patient:', error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', ml: '60px' }}>
      <Box sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Patient Number</th>
              <th>Appointment Number</th>
              <th>Bed Number</th>
              <th>Duration of Stay</th>
              <th>Date Leave</th>
              <th>Actual Leave</th>
              <th>Ward ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inPatients.map((patient) => (
              <tr key={patient.patient_num}>
                <td>{patient.patient_num}</td>
                <td>{patient.appointment_num}</td>
                <td>{patient.bed_num}</td>
                <td>{patient.duration_of_stay}</td>
                <td>{patient.date_leave}</td>
                <td>{patient.actual_leave}</td>
                <td>{patient.ward_id}</td>
                <td>
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(patient)}>
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update In-Patient</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update the details of the in-patient, please edit the information below.
          </DialogContentText>
          <TextField
            margin="dense"
            name="appointment_num"
            label="Appointment Number"
            type="number"
            fullWidth
            value={formData.appointment_num}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="bed_num"
            label="Bed Number"
            type="number"
            fullWidth
            value={formData.bed_num}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="duration_of_stay"
            label="Duration of Stay"
            type="text"
            fullWidth
            value={formData.duration_of_stay}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="date_leave"
            label="Date Leave"
            type="date"
            fullWidth
            value={formData.date_leave}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="actual_leave"
            label="Actual Leave"
            type="date"
            fullWidth
            value={formData.actual_leave}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="ward_id"
            label="Ward ID"
            type="number"
            fullWidth
            value={formData.ward_id}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InPatients;