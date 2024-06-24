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
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../Components/NavList';
import Copyright from '../Components/Copyright';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

export default function PatientRegistrationForm() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleBackClick = () => {
    navigate('/dashboard/forms'); 
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
          <Container maxWidth="lg" sx={{ mt: 7, mb: 9 }}>
            <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content', mx: 'auto' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  height: '100vh', 
                  mt: 5
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',  
                    mb: 5,
                    width: '100%',  
                    alignItems: 'center'
                  }}
                >
                  <Button 
                    variant="text" 
                    color="primary" 
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                    sx={{ ml: 2 }}
                  >
                    Back to Forms
                  </Button>
                  <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ flexGrow: 1 }}>
                    Patient Registration Form
                  </Typography>
                  <div style={{ width: 120 }}></div> {/* Spacer to balance the layout */}
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-start',  
                    mb: 5,
                    width: '100%',  
                    pl: 5, 
                  }}
                >
                  <Paper
                    component="form"
                    sx={{ 
                      p: '1px 8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      width: 400, 
                      ml:5,
                      backgroundColor: '#D8BFD8', 
                      color: '#ffffff', 
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1, color: 'black' }} 
                      placeholder="Search by ID"
                      inputProps={{ 'aria-label': 'search by id' }}
                    />
                    <IconButton type="button" sx={{ p: '10px', color: 'black' }} aria-label="search">
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                </Box>
                <Grid container justifyContent="center" spacing={5}>
                  <Grid item xs={12}>
                    <Box sx={{ ml: 10, mr: 10 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}>First Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Last Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Address</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Sex</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Telephone Number</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Date of Birth</th>
                          </tr>
                        </thead>
                      </table>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ ml: 10, mr: 10 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Full Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Address</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Relationship</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Telephone Number</th>
                          </tr>
                        </thead>
                      </table>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ ml: 10, mr: 10 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Full Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Address</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Telephone Number</th>
                          </tr>
                        </thead>
                      </table>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Container>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
