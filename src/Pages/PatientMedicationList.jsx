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
import { TextField, Button } from '@mui/material';

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

export default function PatientMedicationList() {
  const [open, setOpen] = useState(false);
  const [patientMedication, setPatientMedication] = useState([]);
  const [patientMedicationForm, setPatientMedicationForm] = useState({
    patient_num: '',
    units_per_day: '',
    start_date: '',
    finish_date: '',
  });
  const [selectedList, setSelectedList] = useState(null);
  const [showCreateButton, setShowCreateButton] = useState(true);

  useEffect(() => {
    fetchPatientMedication();
  }, []);

  async function fetchPatientMedication() {
    const { data, error } = await supabase.from('patient_medication').select('*');
    if (error) {
      console.error('Error fetching patient medication:', error);
    } else {
      setPatientMedication(data);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setPatientMedicationForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (selectedList) {
      const { data, error } = await supabase
        .from('patient_medication')
        .update({ finish_date: patientMedicationForm.finish_date })
        .eq('patient_med_num', selectedList.patient_med_num);
      if (error) {
        console.error('Error updating patient medication:', error);
      } else {
        setPatientMedication((prevList) =>
          prevList.map((list) =>
            list.patient_med_num === selectedList.patient_med_num
              ? { ...list, finish_date: patientMedicationForm.finish_date }
              : list
          )
        );
      }
    } else {
      const { data, error } = await supabase.from('patient_medication').insert(patientMedicationForm).select('*');
      if (error) {
        console.error('Error creating patient medication:', error);
      } else if (Array.isArray(data)) {
        setPatientMedication((prevList) => [...prevList, ...data]);
      } else {
        console.error('Unexpected response data:', data);
      }
    }

    setPatientMedicationForm({
      patient_num: '',
      units_per_day: '',
      start_date: '',
      finish_date: '',
    });
    setSelectedList(null);
    setShowCreateButton(true);
  }

  function handleSelectList(list) {
    if (selectedList && selectedList.patient_med_num === list.patient_med_num) {
      setPatientMedicationForm({
        patient_num: '',
        units_per_day: '',
        start_date: '',
        finish_date: '',
      });
      setSelectedList(null);
      setShowCreateButton(true);
    } else {
      setSelectedList(list);
      setPatientMedicationForm({
        patient_num: list.patient_num,
        units_per_day: list.units_per_day,
        start_date: list.start_date,
        finish_date: list.finish_date,
      });
      setShowCreateButton(false);
    }
  }

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
              Patient Medication 
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <Box sx={{ width: '90%', mb: 2 }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      <TextField
                        type="text"
                        placeholder="Patient ID"
                        name="patient_num"
                        value={patientMedicationForm.patient_num}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ m: 1 }}
                        disabled={selectedList !== null}
                      />
                      <TextField
                        type="text"
                        placeholder="Units per Day"
                        name="units_per_day"
                        value={patientMedicationForm.units_per_day}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ m: 1 }}
                        disabled={selectedList !== null}
                      />
                      <TextField
                        type="text"
                        placeholder="Start Date"
                        name="start_date"
                        value={patientMedicationForm.start_date}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ m: 1 }}
                        disabled={selectedList !== null}
                      />
                      <TextField
                        type="text"
                        placeholder="Finish Date"
                        name="finish_date"
                        value={patientMedicationForm.finish_date}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ m: 1 }}
                      />
                      {showCreateButton && (
                        <Button type="submit" variant="contained" color="primary" sx={{ m: 1 }}>
                          Create
                        </Button>
                      )}
                      {selectedList && (
                        <React.Fragment>
                          <Button type="submit" variant="contained" color="primary" sx={{ m: 1 }}>
                            Update
                          </Button>
                        </React.Fragment>
                      )}
                    </form>
                  </Box>
                  <Box sx={{ flexGrow: 1, p: 3, width: '100%' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Patient Medication ID</th>
                          <th>Patient ID</th>
                          <th>Units per Day</th>
                          <th>Start Date</th>
                          <th>Finish Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientMedication.map((list) => (
                          <tr
                            key={list.patient_med_num}
                            onClick={() => handleSelectList(list)}
                            style={{ backgroundColor: selectedList?.patient_med_num === list.patient_med_num ? '#f0f0f0' : 'transparent' }}
                          >
                            <td>{list.patient_med_num}</td>
                            <td>{list.patient_num}</td>
                            <td>{list.units_per_day}</td>
                            <td>{list.start_date}</td>
                            <td>{list.finish_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
