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
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../Components/NavList';
import Copyright from '../Components/Copyright';
import supabase from '../Services/Supabase';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
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
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    address: '',
    tel_number: '',
    date_of_birth: '',
    sex: '',
    marital_status: '',
    hospital_date_registered: ''
  });

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

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleNextOfKinClick = () => {
    setOpenNextOfKinDialog(true);
  };

  const handleNextOfKinClose = () => {
    setOpenNextOfKinDialog(false);
    setSelectedPatient(null);
  };

  const handleCreateOpen = () => {
    setFormData({
      f_name: '',
      l_name: '',
      address: '',
      tel_number: '',
      date_of_birth: '',
      sex: '',
      marital_status: '',
      hospital_date_registered: ''
    });
    setOpenCreateDialog(true);
  };

  const handleCreateClose = () => {
    setOpenCreateDialog(false);
  };

  const handleUpdateOpen = () => {
    if (selectedPatient) {
      setFormData(selectedPatient);
      setOpenUpdateDialog(true);
    }
  };

  const handleUpdateClose = () => {
    setOpenUpdateDialog(false);
  };

  const handleDelete = async () => {
    try {
      if (selectedPatient) {
        const { error } = await supabase
          .from('patient')
          .delete()
          .eq('patient_num', selectedPatient.patient_num);
        
        if (error) {
          console.error('Error deleting patient:', error);
        } else {
          fetchPatients();
          setSelectedPatient(null);
        }
      }
    } catch (error) {
      console.error('Error deleting patient:', error.message);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async () => {
    try {
      const { error } = await supabase
        .from('patient')
        .insert([formData]);
      
      if (error) {
        console.error('Error creating patient:', error);
      } else {
        fetchPatients();
        handleCreateClose();
      }
    } catch (error) {
      console.error('Error creating patient:', error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const { error } = await supabase
        .from('patient')
        .update(formData)
        .eq('patient_num', formData.patient_num);

      if (error) {
        console.error('Error updating patient:', error);
      } else {
        fetchPatients();
        handleUpdateClose();
      }
    } catch (error) {
      console.error('Error updating patient:', error.message);
    }
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
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr
            key={patient.patient_num}
            style={{
              backgroundColor: selectedPatient?.patient_num === patient.patient_num ? '#f0f0f0' : 'transparent'
            }}
            onClick={() => handleRowClick(patient)}
          >
            <td>{patient.patient_num}</td>
            <td>{patient.f_name}</td>
            <td>{patient.l_name}</td>
            <td>{patient.address}</td>
            <td>{patient.tel_number}</td>
            <td>{patient.date_of_birth}</td>
            <td>{patient.sex}</td>
            <td>{patient.marital_status}</td>
            <td>{patient.hospital_date_registered}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
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
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Patients
            </Typography>
            <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
              <Button variant="contained" onClick={() => setView('patients')}>All Patients</Button>
              <Button variant="contained" onClick={() => setView('inPatients')}>In-Patients</Button>
              <Button variant="contained" onClick={() => setView('outPatients')}>Out-Patients</Button>
            </Box>
            {view === 'patients' && (
              <>
                <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateOpen}
                  >
                    Create Patient
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleUpdateOpen}
                    disabled={!selectedPatient}
                  >
                    Update Patient
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!selectedPatient}
                  >
                    Delete Patient
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNextOfKinClick}
                    disabled={!selectedPatient}
                  >
                    View Next of Kin
                  </Button>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '2px solid #800080', overflow: 'hidden' }}>
                      {renderPatientsTable()}
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}
            {view === 'inPatients' && <InPatients />}
            {view === 'outPatients' && <OutPatients />}
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
          <Dialog open={openCreateDialog} onClose={handleCreateClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Patient</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="f_name"
                label="First Name"
                type="text"
                fullWidth
                value={formData.f_name}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="l_name"
                label="Last Name"
                type="text"
                fullWidth
                value={formData.l_name}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="address"
                label="Address"
                type="text"
                fullWidth
                value={formData.address}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="tel_number"
                label="Telephone Number"
                type="text"
                fullWidth
                value={formData.tel_number}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                fullWidth
                value={formData.date_of_birth}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                name="sex"
                label="Sex"
                type="text"
                fullWidth
                value={formData.sex}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="marital_status"
                label="Marital Status"
                type="text"
                fullWidth
                value={formData.marital_status}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="hospital_date_registered"
                label="Date Registered"
                type="date"
                fullWidth
                value={formData.hospital_date_registered}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCreateClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleCreateSubmit} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openUpdateDialog} onClose={handleUpdateClose} fullWidth maxWidth="sm">
            <DialogTitle>Update Patient</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="f_name"
                label="First Name"
                type="text"
                fullWidth
                value={formData.f_name}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="l_name"
                label="Last Name"
                type="text"
                fullWidth
                value={formData.l_name}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="address"
                label="Address"
                type="text"
                fullWidth
                value={formData.address}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="tel_number"
                label="Telephone Number"
                type="text"
                fullWidth
                value={formData.tel_number}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                fullWidth
                value={formData.date_of_birth}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                name="sex"
                label="Sex"
                type="text"
                fullWidth
                value={formData.sex}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="marital_status"
                label="Marital Status"
                type="text"
                fullWidth
                value={formData.marital_status}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="hospital_date_registered"
                label="Date Registered"
                type="date"
                fullWidth
                value={formData.hospital_date_registered}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUpdateSubmit} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
