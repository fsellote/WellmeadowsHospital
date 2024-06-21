import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HotelIcon from '@mui/icons-material/Hotel';
import MedicationIcon from '@mui/icons-material/Medication';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import AirlineSeatFlatAngledIcon from '@mui/icons-material/AirlineSeatFlatAngled';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import { Link } from 'react-router-dom';

const styles = {
  textDecoration: "none",
  color: "inherit"
};

const listItemButtonStyles = {
  '&:hover': {
    backgroundColor: '#800080', 
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: '#fff',
    },
  },
};

export const mainListItems = (
  <React.Fragment>
    <Link to="/dashboard" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/book-appointment" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <BookIcon />
        </ListItemIcon>
        <ListItemText primary="Book Appointment" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/create_staff" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <GroupAddIcon />
        </ListItemIcon>
        <ListItemText primary="Create Staff" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/patients" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <AccessibleForwardIcon />
        </ListItemIcon>
        <ListItemText primary="Patients" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/patient-alloc" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <HotelIcon />
        </ListItemIcon>
        <ListItemText primary="Patient Allocation" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/medication-list" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <MedicalInformationIcon />
        </ListItemIcon>
        <ListItemText primary="Patient Medication List" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/local-doctors" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <NoteAddIcon />
        </ListItemIcon>
        <ListItemText primary="Local Doctors" />
      </ListItemButton>
    </Link>
    <Link to="/list-patient-appointment" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <ListAltIcon />
        </ListItemIcon>
        <ListItemText primary="List Of Patient Appointment" />
      </ListItemButton>
    </Link>
    <Link to="/requiform" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <DynamicFormIcon />
        </ListItemIcon>
        <ListItemText primary="Requisition Form" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/staff-alloc" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <MedicationIcon />
        </ListItemIcon>
        <ListItemText primary="Staff Allocation List" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/stafflist" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText primary="Staff Lists" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/suppliers" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <Inventory2Icon />
        </ListItemIcon>
        <ListItemText primary="Suppliers" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/wards" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <BloodtypeIcon />
        </ListItemIcon>
        <ListItemText primary="Wards" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard/wardstaffalloc" style={styles}>
      <ListItemButton sx={listItemButtonStyles}>
        <ListItemIcon>
          <AirlineSeatFlatAngledIcon />
        </ListItemIcon>
        <ListItemText primary="Ward Staff Allocation" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);
