import React, { useEffect, useState } from 'react';
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
import { Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import supabase from '../Services/Supabase';
import WaitingList from './WaitingList';
import PatientRegistrationForm from './PatientRegistrationForm';

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

const ListOfPa = () => {
  const [listOfPa, setListOfPa] = useState([]);
  const [openWaitingListDialog, setOpenWaitingListDialog] = useState(false);
  const [openRegistrationDialog, setOpenRegistrationDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchListOfPa();
  }, []);

  async function fetchListOfPa() {
    try {
      const { data, error } = await supabase
        .from('patient_appointment')
        .select('*');

      if (error) {
        console.error('Error fetching patient appointments:', error.message);
        return;
      }

      setListOfPa(data);
    } catch (error) {
      console.error('Error fetching patient appointments:', error.message);
    }
  }

  const handleRecommendationChange = (appointmentId, newValue) => {
    setSelectedAppointment({ appointmentId, newValue });
    if (newValue === 'Out-patient') {
      setPrefillData(listOfPa.find(appt => appt.appointment_num === appointmentId));
      setOpenRegistrationDialog(true);
    }
  };

  const handleAddPatient = async () => {
    if (!selectedAppointment) return;

    const { appointmentId, newValue } = selectedAppointment;

    try {
      const { error: updateError } = await supabase
        .from('patient_appointment')
        .update({ recommended_to: newValue })
        .eq('appointment_num', appointmentId);

      if (updateError) {
        console.error('Error updating recommendation:', updateError.message);
        throw updateError;
      }

      await supabase
        .from('in_patient')
        .delete()
        .eq('appointment_num', appointmentId);

      await supabase
        .from('out_patient')
        .delete()
        .eq('appointment_num', appointmentId);

      if (newValue === 'Waiting List') {
        const { error: insertError } = await supabase
          .from('waiting_list')
          .insert({
            appointment_num: appointmentId,
            date_placed: new Date().toISOString().slice(0, 10), 
            ward_id: 1 
          });

        if (insertError) {
          console.error('Error inserting into waiting_list:', insertError.message);
          throw insertError;
        }
      } else {
        const table = newValue === 'In-patient' ? 'in_patient' : 'out_patient';
        const { error: insertError } = await supabase
          .from(table)
          .insert({ appointment_num: appointmentId });

        if (insertError) {
          console.error(`Error inserting into ${table}:`, insertError.message);
          throw insertError;
        }
      }

      setListOfPa(prevList => prevList.map(item =>
        item.appointment_num === appointmentId ? { ...item, recommended_to: newValue } : item
      ));

      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error handling recommendation change:', error.message);
    }
  };

  const handleRegistrationClose = () => {
    setOpenRegistrationDialog(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const { error } = await supabase.rpc('patient_registration_form', formData);
      if (error) {
        console.error('Error registering patient:', error);
        return;
      }

      const { appointment_num } = formData;
      const { error: insertError } = await supabase
        .from('out_patient')
        .insert({ appointment_num });

      if (insertError) {
        console.error('Error inserting into out_patient:', insertError.message);
        throw insertError;
      }

      fetchListOfPa();
      handleRegistrationClose();
    } catch (error) {
      console.error('Error handling form submission:', error);
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

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
          <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleAddPatient} disabled={!selectedAppointment}>
                      Add Patient
                    </Button>
                  </Box>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Appointment ID</th>
                        <th>Date and Time</th>
                        <th>Examination Room</th>
                        <th>Staff ID</th>
                        <th>Clinic ID</th>
                        <th>Recommended to</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listOfPa.map((appointment) => (
                        <tr
                          key={appointment.appointment_num}
                          style={selectedAppointment?.appointmentId === appointment.appointment_num ? { backgroundColor: '#f0f0f0' } : {}}
                        >
                          <td>{appointment.appointment_num}</td>
                          <td>{appointment.date_and_time}</td>
                          <td>{appointment.exam_room}</td>
                          <td>{appointment.staff_num}</td>
                          <td>{appointment.clinic_num}</td>
                          <td className="select-cell">
                            <Select
                              value={appointment.recommended_to}
                              onChange={(e) => handleRecommendationChange(appointment.appointment_num, e.target.value)}
                              fullWidth
                              variant="outlined"
                            >
                              <MenuItem value="Waiting List">Waiting List</MenuItem>
                              <MenuItem value="Out-patient">Out-patient</MenuItem>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Dialog open={openRegistrationDialog} onClose={handleRegistrationClose} fullWidth maxWidth="md">
                    <DialogTitle>Patient Registration</DialogTitle>
                    <DialogContent>
                      <PatientRegistrationForm prefillData={prefillData} onClose={handleRegistrationClose} onSubmit={handleFormSubmit} />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleRegistrationClose} color="secondary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <Typography variant="h5" gutterBottom>
                    Waiting List
                  </Typography>
                  <WaitingList />
                </Paper>
              </Grid>
            </Grid>
          </Container>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ListOfPa;
