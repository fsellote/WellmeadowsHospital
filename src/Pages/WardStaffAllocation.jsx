import React, { useState } from "react";
import supabase from '../Services/Supabase';
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Container, Paper, Toolbar, Grid, CssBaseline, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../Components/NavList';
import Copyright from '../Components/Copyright';

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
        width: theme.spacing(9),
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

const WardStaffAllocation = () => {
  const [wardStaffAllocation, setWardStaffAllocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  async function fetchWardStaffAllocation() {
    try {
      setWardStaffAllocation([]); // Clear previous results
      const { data, error } = await supabase
        .rpc('fetch_staff_allocation', { ward_id_params: parseInt(searchTerm, 10) });

      if (error) {
        console.error('Error fetching staff allocation:', error.message);
        return;
      }

      console.log('Data fetched:', data); // Debugging line
      setWardStaffAllocation(data);
    } catch (error) {
      console.error('Error fetching staff allocation:', error.message);
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Ward Staff Allocation
                  </Typography>
                  <TextField
                    label="Search Ward ID"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={fetchWardStaffAllocation}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {wardStaffAllocation.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h5" component="h2">
                        Wellmeadows Hospital
                      </Typography>
                      <Box className="ward-details" sx={{ mt: 2 }}>
                        <Typography><strong>Ward Number:</strong> {wardStaffAllocation[0].ward_id}</Typography>
                        <Typography><strong>Ward Name:</strong> {wardStaffAllocation[0].ward_name}</Typography>
                        <Typography><strong>Location:</strong> {wardStaffAllocation[0].location}</Typography>
                        <Typography><strong>Charge Nurse:</strong> {wardStaffAllocation[0].charge_nurse}</Typography>
                        <Typography><strong>Staff Number:</strong> {wardStaffAllocation[0].staff_num}</Typography>
                        <Typography><strong>Tel Extn:</strong> {wardStaffAllocation[0].tel_extn}</Typography>
                        <Typography><strong>Week:</strong> {wardStaffAllocation[0].week}</Typography>
                      </Box>
                    </Box>
                  )}
                  {wardStaffAllocation.length > 0 && (
                    <table className="allocation-table" style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th>Staff No.</th>
                          <th>Name</th>
                          <th>Address</th>
                          <th>Tel No</th>
                          <th>Position</th>
                          <th>Shift</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wardStaffAllocation.map((staffallocation, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td>{staffallocation.staff_num}</td>
                            <td>{staffallocation.name}</td>
                            <td>{staffallocation.address}</td>
                            <td>{staffallocation.tel_number}</td>
                            <td>{staffallocation.position}</td>
                            <td>{staffallocation.shift}</td>
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
}

export default WardStaffAllocation;
