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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import supabase from '../Services/Supabase';
import { Link } from 'react-router-dom';

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

export default function WardPage() {
  const [open, setOpen] = useState(false);
  const [ward, setWard] = useState([]);
  const [wardList, setWardList] = useState({
    ward_id: '',
    ward_name: '',
    location: '',
    num_of_beds: '',
    tel_extn: '',
  });
  const [selectedList, setSelectedList] = useState(null);
  const [showCreateButton, setShowCreateButton] = useState(true);

  useEffect(() => {
    fetchWard();
  }, []);

  async function fetchWard() {
    const { data, error } = await supabase
      .from('wards')
      .select('*');
    if (error) {
      console.error('Error fetching wards:', error);
    } else {
      setWard(data);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setWardList(prevList => ({
      ...prevList,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (selectedList) {
      // Update only num_of_beds
      const { data, error } = await supabase
        .from('wards')
        .update({ num_of_beds: wardList.num_of_beds })
        .eq('ward_id', selectedList.ward_id);
      if (error) {
        console.error('Error updating wards:', error);
      } else {
        setWard(prevLists =>
          prevLists.map(list =>
            list.ward_id === selectedList.ward_id ? { ...list, num_of_beds: wardList.num_of_beds } : list
          )
        );
      }
    } else {
      // Create new ward
      const { data, error } = await supabase
        .from('wards')
        .insert(wardList)
        .select('*');
      if (error) {
        console.error('Error creating wards:', error);
      } else if (Array.isArray(data)) {
        setWard(prevLists => [...prevLists, ...data]);
      } else {
        console.error('Unexpected response data:', data);
      }
    }

    setWardList({
        ward_id: '',
        ward_name: '',
        location: '',
        num_of_beds: '',
        tel_extn: '',
    });
    setSelectedList(null);
    setShowCreateButton(true);
  }

  function handleSelectList(list) {
    if (selectedList && selectedList.ward_id === list.ward_id) {
      setWardList({
        ward_id: '',
        ward_name: '',
        location: '',
        num_of_beds: '',
        tel_extn: '',
      });
      setSelectedList(null);
      setShowCreateButton(true); // Show the create button after deselection
    } else {
      // Select the ward
      setSelectedList(list);
      setWardList({
        ward_id: list.ward_id,
        ward_name: list.ward_name,
        location: list.location,
        num_of_beds: list.num_of_beds,
        tel_extn: list.tel_extn,
      });
      setShowCreateButton(false); // Hide the create button when a ward is selected
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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ward Management
            </Typography>
            <Typography variant="body1" gutterBottom>
              Manage the wards of Wellmeadows Hospital.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ward ID"
                        name="ward_id"
                        value={wardList.ward_id}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        disabled={selectedList !== null} // Disable field when updating
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ward Name"
                        name="ward_name"
                        value={wardList.ward_name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        disabled={selectedList !== null} // Disable field when updating
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Location"
                        name="location"
                        value={wardList.location}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        disabled={selectedList !== null} // Disable field when updating
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Number of Beds"
                        name="num_of_beds"
                        value={wardList.num_of_beds}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Telephone Extension"
                        name="tel_extn"
                        value={wardList.tel_extn}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        disabled={selectedList !== null} // Disable field when updating
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    {showCreateButton && (
                      <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Create
                      </Button>
                    )}
                    {selectedList && (
                      <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Update
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" component="h3" gutterBottom>
                  Wards List
                </Typography>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ward ID</th>
                      <th>Ward Name</th>
                      <th>Location</th>
                      <th>Number of Beds</th>
                      <th>Telephone Extension</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ward.map((list) => (
                      <tr key={list.ward_id} onClick={() => handleSelectList(list)} style={{ backgroundColor: selectedList?.ward_id === list.ward_id ? '#f0f0f0' : 'transparent' }}>
                        <td>{list.ward_id}</td>
                        <td>{list.ward_name}</td>
                        <td>{list.location}</td>
                        <td>{list.num_of_beds}</td>
                        <td>{list.tel_extn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Grid>
            </Grid>
          </Container>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
