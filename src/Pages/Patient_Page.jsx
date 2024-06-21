import { useEffect, useState } from "react";
import supabase from '../Services/Supabase';
import { Box, Select, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';



const Patient_Page = () => {
    const [patient, setPatient] = useState([]);

    const [patients, setPatients]=useState({
        f_name:'',
        l_name:'',
        address:'',
        tel_number:'',
        date_of_birth:'',
        sex:'',
        marital_status:'',
        hospital_date_registered:''
      })
  
    useEffect(() => {
      fetchPatient();
    }, []);
  
    async function fetchPatient() {
      try {
        const { data, error } = await supabase
          .from('patient')
          .select('*');
  
        if (error) {
          console.error('Error fetching patient:', error.message);
          return;
        }
  
        setPatient(data);
        console.log(data); 
      } catch (error) {
        console.error('Error fetching patient', error.message);
      }
    }

    function handleChange(event){
        setPatients(prevFormData=>{
            return{
                ...prevFormData,
                [event.target.name]:event.target.value
            }
        })
    }

    async function addPatient() {
        await supabase  
        .from('patient')
        .insert({ f_name: patients.f_name, 
            l_name: patients.l_name,
            address: patients.address,
            tel_number: patients.tel_number,
            date_of_birth: patients.date_of_birth,
            sex: patients.sex,
            marital_status: patients.marital_status,
            hospital_date_registered: patients.hospital_date_registered})
        }
    return (
        <Box sx={{ flexGrow: 1, p: 3 }} className="table-container">
            <form onSubmit={addPatient}>
                <input 
                    type="text" 
                    placeholder="First Name"
                    name='f_name'
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="Last Name"
                    name='l_name'
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="Address"
                    name='address'
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="Telephone Number"
                    name='tel_number'
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="Date of Birth"
                    name='date_of_birth'
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="Sex"
                    name='sex'
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="Marital Status"
                    name='marital_status'
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="Hospital Date Registered"
                    name='hospital_date_registered'
                    onChange={handleChange}
                />
                <button type='submit'>Save</button>
            </form>




            <table className="table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Address</th>
                  <th>Telephone Number</th>
                  <th>Date of Birth</th>
                  <th>Sex</th>
                  <th>Marital Status</th>
                  <th>Hospital Date Registered</th>
                </tr>
              </thead>
    
              <tbody>
                {patient.map((patients) => (
                  <tr key={patients.patient_num}>
                    <td>{patients.patient_num}</td>
                    <td>{patients.f_name}</td>
                    <td>{patients.l_name}</td>
                    <td>{patients.address}</td>
                    <td>{patients.tel_number}</td>
                    <td>{patients.date_of_birth}</td>
                    <td>{patients.sex}</td>
                    <td>{patients.marital_status}</td>
                    <td>{patients.hospital_date_registered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
                variant="contained"
                color="primary"
                >
                Save
            </Button>
        </Box>
      );
    }
export default Patient_Page