import React, { useState } from 'react';
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
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import supabase from '../Services/Supabase';
import '../patient_allocation.css';

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

const Patient_Allocation = () => {
  const [patientAllocation, setPatientAllocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  async function fetchPatientAllocation() {
    try {
      setPatientAllocation([]); // Clear previous results
      const { data, error } = await supabase.rpc('fetch_patient_allocation', { ward_id_params: parseInt(searchTerm, 10) });

      if (error) {
        console.error('Error fetching patient allocation:', error.message);
        return;
      }

      console.log('Data fetched:', data); // Debugging line
      setPatientAllocation(data);
    } catch (error) {
      console.error('Error fetching patient allocation:', error.message);
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
                  <Typography variant="h4" component="h1" className="title">
                    Patient Allocation
                  </Typography>
                  <TextField
                    label="Search Ward ID"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={fetchPatientAllocation}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {patientAllocation.length > 0 && (
                    <Box>
                      <Typography variant="h5" component="h2">
                        Wellmeadows Hospital
                      </Typography>
                      <Box className="ward-details">
                        <Typography><strong>Ward Number:</strong> {patientAllocation[0].ward_id}</Typography>
                        <Typography><strong>Ward Name:</strong> {patientAllocation[0].ward_name}</Typography>
                        <Typography><strong>Location:</strong> {patientAllocation[0].location}</Typography>
                        <Typography><strong>Charge Nurse:</strong> {patientAllocation[0].charge_nurse}</Typography>
                        <Typography><strong>Staff Number:</strong> {patientAllocation[0].staff_num}</Typography>
                        <Typography><strong>Tel Extn:</strong> {patientAllocation[0].tel_extn}</Typography>
                        <Typography><strong>Week:</strong> {patientAllocation[0].week}</Typography>
                      </Box>
                    </Box>
                  )}
                  {patientAllocation.length > 0 && (
                    <table className="allocation-table">
                      <thead>
                        <tr>
                          <th>Patient Number</th>
                          <th>Name</th>
                          <th>On Waiting List</th>
                          <th>Expected Stay (Days)</th>
                          <th>Date Placed</th>
                          <th>Date Leave</th>
                          <th>Actual Leave</th>
                          <th>Bed Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientAllocation.map((patientallocation, index) => (
                          <tr key={index}>
                            <td>{patientallocation.patient_num}</td>
                            <td>{patientallocation.name}</td>
                            <td>{patientallocation.on_waiting_list}</td>
                            <td>{patientallocation.expected_stay}</td>
                            <td>{patientallocation.date_placed}</td>
                            <td>{patientallocation.date_leave}</td>
                            <td>{patientallocation.actual_leave}</td>
                            <td>{patientallocation.bed_number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Container>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Patient_Allocation;
