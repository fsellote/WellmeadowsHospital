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
import IconButton from '@mui/material/IconButton';;
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../Components/NavList';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import supabase from '../Services/Supabase';
import '../requisition_form.css';

const drawerWidth = 240;

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

const Requisition_Form = ({ pharmaceuticalSupplies, setPharmaceuticalSupplies, surgical_and_nonsurgical, setSurgical_and_Nonsurgical }) => {
  const initialFormData = {
    new_ward_id: '',
    new_staff_num: '',
    new_date_ordered: '',
    new_quantity: '',
    new_drug_num: '',
    new_item_num: '',
    new_dosage: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [requisitionResult, setRequisitionResult] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.rpc('requisition_form', {
        new_ward_id: parseInt(formData.new_ward_id),
        new_staff_num: parseInt(formData.new_staff_num),
        new_date_ordered: formData.new_date_ordered,
        new_quantity: parseInt(formData.new_quantity),
        new_drug_num: parseInt(formData.new_drug_num),
        new_item_num: parseInt(formData.new_item_num),
        new_dosage: formData.new_dosage
      });

      if (error) {
        console.error('Error:', error.message);
        return;
      }

      console.log('Data:', data); 

      if (data && data.length > 0) {
        console.log('New Drug Number:', data[0].new_drug_num);
        console.log('New Item Number:', data[0].new_item_num);

    
        if (data[0].new_drug_num) {
          const updatedPharmaceuticalSupplies = pharmaceuticalSupplies.map(supply => {
            if (supply.drug_num === data[0].new_drug_num) {
              const updatedSupply = { ...supply };
              updatedSupply.quantity_in_stock -= data[0].new_quantity;
              return updatedSupply;
            }
            return supply;
          });
          setPharmaceuticalSupplies(updatedPharmaceuticalSupplies);
        }

        if (data[0].new_item_num) {
          const updatedSurgicalNonsurgicalSupplies = surgical_and_nonsurgical.map(supply => {
            if (supply.item_num === data[0].new_item_num) {
              const updatedSupply = { ...supply };
              updatedSupply.quantity_of_stocks -= data[0].new_quantity;
              return updatedSupply;
            }
            return supply;
          });
          setSurgical_and_Nonsurgical(updatedSurgicalNonsurgicalSupplies);
        }

        setRequisitionResult(data[0]); 
        setOpenDialog(true); 
      } else {
        console.warn('No data returned from requisition form RPC call.');
        setRequisitionResult(null);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData); 
    setRequisitionResult(null); 
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
          <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <Typography variant="h4" gutterBottom>
                    Requisition Form
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Ward ID"
                          name="new_ward_id"
                          value={formData.new_ward_id}
                          onChange={handleChange}
                          fullWidth
                          required
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Staff Number"
                          name="new_staff_num"
                          value={formData.new_staff_num}
                          onChange={handleChange}
                          fullWidth
                          required
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Date Ordered"
                          name="new_date_ordered"
                          type="date"
                          value={formData.new_date_ordered}
                          onChange={handleChange}
                          fullWidth
                          required
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Quantity"
                          name="new_quantity"
                          type="number"
                          value={formData.new_quantity}
                          onChange={handleChange}
                          fullWidth
                          required
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Drug Number (Optional)"
                          name="new_drug_num"
                          type="number"
                          value={formData.new_drug_num}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Item Number (Optional)"
                          name="new_item_num"
                          type="number"
                          value={formData.new_item_num}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Dosage (Optional)"
                          name="new_dosage"
                          value={formData.new_dosage}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                          Submit Requisition
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Requisition Receipt</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        <div className="receipt">
                          <table className="receipt-table">
                            <tbody>
                              <tr>
                                <td className="label">Requisition Number:</td>
                                <td>{requisitionResult?.requisition_num}</td>
                              </tr>
                              <tr>
                                <td className="label">Ward ID:</td>
                                <td>{requisitionResult?.ward_id}</td>
                              </tr>
                              <tr>
                                <td className="label">Requisitioned By:</td>
                                <td>{requisitionResult?.requisitioned_by}</td>
                              </tr>
                              <tr>
                                <td className="label">Ward Name:</td>
                                <td>{requisitionResult?.ward_name}</td>
                              </tr>
                              <tr>
                                <td className="label">Requisitioned Date:</td>
                                <td>{requisitionResult?.requisitioned_date}</td>
                              </tr>
                              <tr>
                                <td className="label">Supply Number:</td>
                                <td>{requisitionResult?.supply_num}</td>
                              </tr>
                              <tr>
                                <td className="label">Supply Name:</td>
                                <td>{requisitionResult?.supply_name}</td>
                              </tr>
                              <tr>
                                <td className="label">Description:</td>
                                <td>{requisitionResult?.description}</td>
                              </tr>
                              <tr>
                                <td className="label">Dosage:</td>
                                <td>{requisitionResult?.dosage}</td>
                              </tr>
                              <tr>
                                <td className="label">Method of Administration:</td>
                                <td>{requisitionResult?.method_of_admin}</td>
                              </tr>
                              <tr>
                                <td className="label">Cost per Unit:</td>
                                <td>{requisitionResult?.cost_per_unit}</td>
                              </tr>
                              <tr>
                                <td className="label">Quantity:</td>
                                <td>{requisitionResult?.quantity}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Requisition_Form;
