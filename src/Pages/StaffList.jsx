import * as React from 'react';
import { useEffect, useState } from "react";
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
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

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

export default function StaffList() {
  const [open, setOpen] = React.useState(false);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    staffNum: '',
    wardId: '',
    shift: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*');

      if (error) {
        console.error('Error fetching staff:', error.message);
        return;
      }

      setStaff(data);
      console.log(data); // Check if data is fetched correctly
    } catch (error) {
      console.error('Error fetching staff:', error.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateStaffAllocation = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_allocation')
        .insert([{ 
          staff_num: formData.staffNum,
          ward_id: formData.wardId,
          shift: formData.shift,
        }]);

      if (error) {
        console.error('Error inserting staff allocation:', error.message);
        window.alert(`Failed to create staff allocation: ${error.message}`);
        return;
      }

      console.log('Inserted staff allocation data:', data);
      // Optionally, you can fetch the updated data after insertion
      await fetchStaff();
      window.alert('Staff allocation created successfully!');
    } catch (error) {
      console.error('Error creating staff allocation:', error.message);
      window.alert('Failed to create staff allocation');
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSeeStaffAllocationClick = () => {
    navigate('/dashboard/staff-alloc');
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
          <Container maxWidth="lg" sx={{ mt: 9, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Staff List
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button
                  sx={{ mb: 2 }}
                  variant="contained"
                  color="primary"
                  onClick={handleSeeStaffAllocationClick}
                >
                  See Staff Allocation
                </Button>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ whiteSpace: 'nowrap' }}>ID</th>
                        <th style={{ whiteSpace: 'nowrap' }}>First Name</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Last Name</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Address</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Telephone Number</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Date of Birth</th>
                        <th style={{ whiteSpace: 'nowrap' }}>NIN</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Sex</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Salary Scale</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Salary</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((staffMember) => (
                        <tr key={staffMember.staff_num}>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.staff_num}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.f_name}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.l_name}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.address}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.tel_number}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.date_of_birth}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.nin}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.sex}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.salary_scale}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.salary}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Paper>
              </Grid>
            </Grid>
            {/* Form for creating staff allocation */}
            <Box sx={{ marginTop: 2 }}>
              <TextField
                label="Staff Number"
                name="staffNum"
                value={formData.staffNum}
                onChange={handleChange}
                variant="outlined"
                sx={{ marginRight: 2 }}
              />
              <TextField
                label="Ward ID"
                name="wardId"
                value={formData.wardId}
                onChange={handleChange}
                variant="outlined"
                sx={{ marginRight: 2 }}
              />
              <TextField
                label="Shift"
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                variant="outlined"
                sx={{ marginRight: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateStaffAllocation}
              >
                Create Staff Allocation
              </Button>
            </Box>
          </Container>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
