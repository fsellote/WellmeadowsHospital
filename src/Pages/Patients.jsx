import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../Components/NavList';
import Copyright from '../Components/Copyright';
import supabase from '../Services/Supabase';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import InPatients from './InPatients';
import OutPatients from './OutPatients';
import NextOfKin from './NextOfKin';

const drawerWidth = 290;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  })
);

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#800080', // Purple color
    },
  },
  typography: {
    fontFamily: ['"Outfit"', 'sans-serif'].join(','),
  },
});

export default function Patients() {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [view, setView] = useState('patients');
  const [openNextOfKinDialog, setOpenNextOfKinDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const { data, error } = await supabase
        .from('patient')
        .select('*');

      if (error) {
        console.error('Error fetching patients:', error);
      } else {
        setPatients(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    }
  }

  const handleNextOfKinClick = (patient) => {
    setSelectedPatient(patient);
    setOpenNextOfKinDialog(true);
  };

  const handleNextOfKinClose = () => {
    setOpenNextOfKinDialog(false);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const renderPatientsTable = () => (
    <table className="table">
      <thead>
        <tr>
          <th>Patient Number</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Address</th>
          <th>Telephone Number</th>
          <th>Date of Birth</th>
          <th>Sex</th>
          <th>Marital Status</th>
          <th>Date Registered</th>
          <th>Next of Kin</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.patient_num}>
            <td>{patient.patient_num}</td>
            <td>{patient.f_name}</td>
            <td>{patient.l_name}</td>
            <td>{patient.address}</td>
            <td>{patient.tel_number}</td>
            <td>{patient.date_of_birth}</td>
            <td>{patient.sex}</td>
            <td>{patient.marital_status}</td>
            <td>{patient.hospital_date_registered}</td>
            <td>
              <Button variant="contained" color="secondary" onClick={() => handleNextOfKinClick(patient)}>
                View Next of Kin
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Wellmeadows Hospital
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Patients
            </Typography>
            <Button variant="contained" onClick={() => setView('patients')}>All Patients</Button>
            <Button variant="contained" onClick={() => setView('inPatients')}>In Patients</Button>
            <Button variant="contained" onClick={() => setView('outPatients')}>Out Patients</Button>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  {view === 'patients' && renderPatientsTable()}
                  {view === 'inPatients' && <InPatients />}
                  {view === 'outPatients' && <OutPatients />}
                </Paper>
              </Grid>
            </Grid>
          </Container>
          <Dialog open={openNextOfKinDialog} onClose={handleNextOfKinClose} fullWidth maxWidth="sm">
            <DialogTitle>Next of Kin</DialogTitle>
            <DialogContent>
              {selectedPatient && <NextOfKin patientNum={selectedPatient.patient_num} />}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNextOfKinClose} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
