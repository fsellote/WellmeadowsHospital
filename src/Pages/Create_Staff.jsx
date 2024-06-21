import React, { useState } from "react";
import supabase from '../Services/Supabase';
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
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';

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

export default function Create_Staff() {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState({
    f_name: '',
    l_name: '',
    address: '',
    tel_number: '',
    date_of_birth: '',
    nin: '',
    sex: '',
    salary_scale: '',
    salary: '',
    position: ''
  });
  const [error, setError] = useState(null);

  function handleChange(event) {
    setStaff(prevFormData => ({
      ...prevFormData,
      [event.target.name]: event.target.value
    }));
  }

  async function addStaff(event) {
    event.preventDefault();
    setError(null);

    if (!staff.f_name || !staff.l_name || !staff.tel_number || !staff.position) {
      setError("Please fill in all required fields.");
      return;
    }

    const { data, error } = await supabase
      .from('staff')
      .insert(staff);

    if (error) {
      console.error("Error inserting data:", error);
      setError("Failed to save staff details. Please try again.");
    } else {
      console.log("Staff added:", data);
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
              Create Staff
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 5, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <form onSubmit={addStaff}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="First Name"
                          name="f_name"
                          onChange={handleChange}
                          value={staff.f_name}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Last Name"
                          name="l_name"
                          onChange={handleChange}
                          value={staff.l_name}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Address"
                          name="address"
                          onChange={handleChange}
                          value={staff.address}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Telephone Number"
                          name="tel_number"
                          onChange={handleChange}
                          value={staff.tel_number}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Date of Birth"
                          name="date_of_birth"
                          onChange={handleChange}
                          value={staff.date_of_birth}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="NIN"
                          name="nin"
                          onChange={handleChange}
                          value={staff.nin}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Sex"
                          name="sex"
                          onChange={handleChange}
                          value={staff.sex}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Salary Scale"
                          name="salary_scale"
                          onChange={handleChange}
                          value={staff.salary_scale}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Salary"
                          name="salary"
                          onChange={handleChange}
                          value={staff.salary}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Position"
                          name="position"
                          onChange={handleChange}
                          value={staff.position}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Button type='submit' variant="contained" color="primary">
                        Save
                      </Button>
                    </Box>
                  </form>
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
