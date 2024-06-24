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
import { useNavigate } from 'react-router-dom';

// imglist components
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import InfoIcon from '@mui/icons-material/Info';

// local images
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';
import img6 from '../assets/6.jpg';

// for mui chart
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';
import {
  blueberryTwilightPalette,
} from '@mui/x-charts/colorPalettes';
import Stack from '@mui/material/Stack';

// card component
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

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

// Create a custom theme with the primary color set to purple
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#800080', // Purple color
    },
  },
  typography: {
    // Define the outfit font style
    fontFamily: ['"Outfit"', 'sans-serif'].join(','),
  },
});

const chance = new Chance(42);

function getGaussianSeriesData(mean, stdev = [0.3, 0.4], N = 50) {
  return [...Array(N)].map((_, i) => {
    const x =
      Math.sqrt(-2.0 * Math.log(1 - chance.floating({ min: 0, max: 0.99 }))) *
        Math.cos(2.0 * Math.PI * chance.floating({ min: 0, max: 0.99 })) *
        stdev[0] +
      mean[0];
    const y =
      Math.sqrt(-2.0 * Math.log(1 - chance.floating({ min: 0, max: 0.99 }))) *
        Math.cos(2.0 * Math.PI * chance.floating({ min: 0, max: 0.99 })) *
        stdev[1] +
      mean[1];
    return { x, y, id: i };
  });
}

const legendPlacement = {
  slotProps: {
    legend: {
      position: {
        vertical: 'middle',
        horizontal: 'right',
      },
      direction: 'column',
      itemGap: 2,
    },
  },
  margin: {
    top: 20,
    right: 100,
  },
};

const series = [
  { label: 'January', data: getGaussianSeriesData([-5, 0]) },
  { label: 'February', data: getGaussianSeriesData([-4, 0]) },
  { label: 'March', data: getGaussianSeriesData([-3, 0]) },
  { label: 'April', data: getGaussianSeriesData([-2, 0]) },
  { label: 'May', data: getGaussianSeriesData([-1, 0]) },
  { label: 'June', data: getGaussianSeriesData([0, 0]) },
  { label: 'July', data: getGaussianSeriesData([1, 0]) },
  { label: 'August', data: getGaussianSeriesData([2, 0]) },
  { label: 'September', data: getGaussianSeriesData([3, 0]) },
  { label: 'October', data: getGaussianSeriesData([4, 0]) },
  { label: 'November', data: getGaussianSeriesData([5, 0]) },
  { label: 'December', data: getGaussianSeriesData([6, 0]) },
].map((s) => ({
  ...s,
  valueFormatter: (v) => `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
}));

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const logout = () => {
    navigate("/");
  };

  const itemData = [
    {
      img: img1,
      title: 'Gynecology',
      rows: 2,
      cols: 2,
      featured: true,
    },
    {
      img: img2,
      title: 'Orthopedics',
    },
    {
      img: img3,
      title: 'Anesthetics',
    },
    {
      img: img4,
      title: 'Neurology',
    },
    {
      img: img5,
      title: 'General Surgery',
    },
    {
      img: img6,
      title: 'General Surgery',
    },
  ];

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
              sx={{ fontFamily: '"Outfit", sans-serif', flexGrow: 5 }}
            >
              Wellmeadows Hospital
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={logout}>
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
            overflowY: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="false" sx={{ mt: 3, mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 4, border: '1px solid #000', pt: 1 }}>
                  <Typography variant="h5" component="h7" sx={{ mt: 0, mb: 2, color: '#702963' }} gutterBottom>
                    <h2>Welcome to 
                    <br />Wellmeadows Hospital!</h2>
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontStyle: 'italic' }}>
                    Wellmeadows Hospital, a dedicated healthcare facility for elderly patients, focuses on providing comprehensive medical care and support. This website records and manages patient data, staff data, and operational details of the hospital. With a user-friendly interface, the site allows authorized personnel to access vital information, enhancing the efficiency and effectiveness of medical services.
                  </Typography>
                  <Divider sx={{ my: 2, borderBottomWidth: '3px', borderColor: '#000' }} />
                  <Stack direction="column" spacing={2} sx={{ mt: 4 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                      Wellmeadows Healthcare Data <br /> (Patient Data Monthly)
                    </Typography>
                    <ScatterChart
                      height={400}
                      series={series}
                      yAxis={[{ min: -1.5, max: 1.5 }]}
                      colors={blueberryTwilightPalette}
                      {...legendPlacement}
                    />
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, backgroundColor: '#301934', color: '#fff' }}>
                  <Typography variant="h6" gutterBottom>
                    Healthcare Services
                  </Typography>
                  <ImageList sx={{ width: '100%', height: 450 }}>
                    {itemData.map((item) => (
                      <ImageListItem key={item.img}>
                        <img
                          srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          src={`${item.img}?w=248&fit=crop&auto=format`}
                          alt={item.title}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          title={item.title}
                          subtitle={item.author}
                          actionIcon={
                            <IconButton
                              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                              aria-label={`info about ${item.title}`}
                            >
                              <InfoIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Paper>
                <Card sx={{ maxWidth: '100%', mt: 3 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="160"
                      image="src/assets/samplestaffform.png"
                      alt="staff form"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Staff Form Sample
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This is a sample form used to record the details of a member of staff.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
