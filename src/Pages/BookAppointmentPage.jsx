import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';;
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../Components/NavList';
import Copyright from '../Components/Copyright';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import supabase from '../Services/Supabase';

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
      main: '#800080', 
    },
  },
  typography: {
    fontFamily: ['"Outfit"', 'sans-serif'].join(','),
  },
});

export default function BookAppointmentPage() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [patientAppointment, setPatientAppointment] = useState({
    staff_num: '',
    clinic_num: '',
    exam_room: '',
    recommended_to: null
  });

  const [error, setError] = useState(null);

  function handleChange(event) {
    setPatientAppointment(prevFormData => ({
      ...prevFormData,
      [event.target.name]: event.target.value
    }));
  }

  async function addPatientAppointment(event) {
    event.preventDefault();
    setError(null); 

    // Basic validation
    if (!patientAppointment.staff_num || !patientAppointment.clinic_num || !patientAppointment.exam_room) {
      setError("Please fill in all required fields.");
      return;
    }

    
    if (patientAppointment.recommended_to !== null && !['In-patient', 'Out-patient'].includes(patientAppointment.recommended_to)) {
      setError("Recommended to must be 'In-patient' or 'Out-patient'.");
      return;
    }

    
    const currentDateAndTime = new Date().toISOString();

    
    const appointmentData = {
      staff_num: patientAppointment.staff_num,
      clinic_num: patientAppointment.clinic_num,
      exam_room: patientAppointment.exam_room,
      date_and_time: currentDateAndTime,
      recommended_to: patientAppointment.recommended_to
    };

    const { data, error } = await supabase
      .from('patient_appointment')
      .insert(appointmentData);

    if (error) {
      console.error("Error inserting data:", error);
      setError(`Failed to save patient appointment details. Error: ${error.message}`);
    } else {
      console.log("Patient appointment added:", data);
      alert("Appointment successfully added!");
      setPatientAppointment({
        staff_num: '',
        clinic_num: '',
        exam_room: '',
        recommended_to: null
      });
    }
  }  

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
          <Container maxWidth="lg" sx={{ mt: 10, mb: 20 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 5, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Book Your Appointment
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Book your appointment today and take the first step towards better health with Wellmeadows Hospital!
                  </Typography>
                  <Box
                    component="form"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      '& > :not(style)': { m: 1 },
                    }}
                    onSubmit={addPatientAppointment}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                      <TextField
                        label="Staff ID"
                        variant="outlined"
                        name='staff_num'
                        margin="normal"
                        sx={{ m: 1 }}
                        value={patientAppointment.staff_num}
                        onChange={handleChange}
                      />
                      <TextField
                        label="Clinic ID"
                        variant="outlined"
                        name='clinic_num'
                        margin="normal"
                        sx={{ m: 1 }}
                        value={patientAppointment.clinic_num}
                        onChange={handleChange}
                      />
                      <TextField
                        label="Exam Room"
                        variant="outlined"
                        name='exam_room'
                        margin="normal"
                        sx={{ m: 1 }}
                        value={patientAppointment.exam_room}
                        onChange={handleChange}
                      />
                    </Box>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <Button type='submit' variant="contained" color="primary">
                      Book Appointment
                    </Button>
                  </Box>
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
