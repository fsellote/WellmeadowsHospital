import React from 'react';
import LoginPage from '../Pages/Login';
import SignUpForm from '../Pages/SignUp';
import Dashboard from '../Pages/Dashboard';
import BookAppointmentPage from '../Pages/BookAppointmentPage';
import LocalDoctorsPage from '../Pages/LocalDoctorsPage';
import StaffForm from '../Pages/StaffForm';
import PatientMedicationList from '../Pages/PatientMedicationList';
import RequisitionForm from '../Pages/Requisition_Form'; 
import StaffList from '../Pages/StaffList';
import Patient_Page from '../Pages/Patient_Page';
import Create_Staff from '../Pages/Create_Staff';
import PatientRegistrationForm from '../Pages/PatientRegistrationForm';
import Suppliers from '../Pages/Suppliers';
import WardPage from '../Pages/WardPage'; 
import Staff_Allocation from '../Pages/Staff_Allocation'; 
import WardStaffAllocation from '../Pages/WardStaffAllocation';
import Patients from '../Pages/Patients';
import Patient_Allocation from '../Pages/Patient_Allocation';
import ListOfPa from '../Pages/ListOfPa';

const routes = [
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignUpForm /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/forms/patient-registration", element: <PatientRegistrationForm /> },
  { path: "/dashboard/forms/staff-form", element: <StaffForm /> },
  { path: "/dashboard/forms/patient-medication", element: <PatientMedicationList /> },
  { path: "/dashboard/book-appointment", element: <BookAppointmentPage /> },
  { path: "/dashboard/local-doctors", element: <LocalDoctorsPage /> },
  { path: "/dashboard/stafflist", element: <StaffList /> },
  { path: "/patient_page", element: <Patient_Page /> },
  { path: "/dashboard/create_staff", element: <Create_Staff /> },
  { path: "/book-appointment", element: <BookAppointmentPage /> },
  { path: "/patient-registration", element: <PatientRegistrationForm /> },
  { path: "/dashboard/suppliers", element: <Suppliers /> },
  { path: "/dashboard/wards", element: <WardPage /> },
  { path: "/dashboard/staff-alloc", element: <Staff_Allocation /> },
  { path: "/dashboard/wardstaffalloc", element: <WardStaffAllocation /> },
  { path: "/dashboard/medication-list", element: <PatientMedicationList /> },
  { path: "/dashboard/patients", element: <Patients /> },
  { path: "/requiform", element: <RequisitionForm /> },
  { path: "/dashboard/patient-alloc", element: <Patient_Allocation /> },
  { path: "/list-patient-appointment", element: <ListOfPa /> }
];

export default routes;
