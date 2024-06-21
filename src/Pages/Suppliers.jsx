import React, { useState, useEffect, useRef } from 'react';
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
import Stack from '@mui/material/Stack';

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

const PharmaceuticalSuppliesPage = () => {
  const [pharmaceuticalSupplies, setPharmaceuticalSupplies] = useState([]);
  const [pharmaceuticalSupply, setPharmaceuticalSupply] = useState({
    supplier_num: '',
    name: '',
    description: '',
    dosage: '',
    method_of_admin: '',
    quantity_in_stock: '',
    reorder_level: '',
    cost_per_unit: ''
  });
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [showCreateButton, setShowCreateButton] = useState(true);

  useEffect(() => {
    fetchPharmaceuticalSupplies();
  }, []);

  async function fetchPharmaceuticalSupplies() {
    const { data, error } = await supabase
      .from('pharmaceutical_supplies')
      .select('*');
    if (error) {
      console.error('Error fetching pharmaceutical supplies:', error);
    } else {
      setPharmaceuticalSupplies(data);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setPharmaceuticalSupply(prevSupply => ({
      ...prevSupply,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (selectedSupply) {
      // Update supply
      const { data, error } = await supabase
        .from('pharmaceutical_supplies')
        .update(pharmaceuticalSupply)
        .eq('drug_num', selectedSupply.drug_num);
      if (error) {
        console.error('Error updating pharmaceutical supply:', error);
      } else {
        setPharmaceuticalSupplies(prevSupplies =>
          prevSupplies.map(supply =>
            supply.drug_num === selectedSupply.drug_num ? { ...supply, ...pharmaceuticalSupply } : supply
          )
        );
      }
    } else {
      // Create new supply
      const { data, error } = await supabase
        .from('pharmaceutical_supplies')
        .insert(pharmaceuticalSupply)
        .select('*');
      if (error) {
        console.error('Error creating pharmaceutical supply:', error);
      } else if (Array.isArray(data)) {
        setPharmaceuticalSupplies(prevSupplies => [...prevSupplies, ...data]);
      } else {
        console.error('Unexpected response data:', data);
      }
    }

    setPharmaceuticalSupply({
      supplier_num: '',
      name: '',
      description: '',
      dosage: '',
      method_of_admin: '',
      quantity_in_stock: '',
      reorder_level: '',
      cost_per_unit: ''
    });
    setSelectedSupply(null);
    setShowCreateButton(true); // Show the create button after form submission
  }

  async function handleDelete(drug_num) {
    console.log('Deleting pharmaceutical supply:', drug_num);
    try {
      const { error } = await supabase
        .from('pharmaceutical_supplies')
        .delete()
        .eq('drug_num', drug_num);
      if (error) {
        console.error('Error deleting pharmaceutical supply:', error);
      } else {
        // Update the supplies list after successful deletion
        setPharmaceuticalSupplies(prevSupplies => prevSupplies.filter(supply => supply.drug_num !== drug_num));
      }
    } catch (error) {
      console.error('Error deleting pharmaceutical supply:', error.message);
    }

    // Reset form after deletion
    setPharmaceuticalSupply({
      supplier_num: '',
      name: '',
      description: '',
      dosage: '',
      method_of_admin: '',
      quantity_in_stock: '',
      reorder_level: '',
      cost_per_unit: ''
    });
    setSelectedSupply(null);
    setShowCreateButton(true); // Show the create button after deletion
  }

  function handleSelectSupply(supply) {
    if (selectedSupply && selectedSupply.drug_num === supply.drug_num) {
      // If the same supply is clicked again, deselect it
      setPharmaceuticalSupply({
        supplier_num: '',
        name: '',
        description: '',
        dosage: '',
        method_of_admin: '',
        quantity_in_stock: '',
        reorder_level: '',
        cost_per_unit: ''
      });
      setSelectedSupply(null);
      setShowCreateButton(true); // Show the create button after deselection
    } else {
      // Select the supply
      setSelectedSupply(supply);
      setPharmaceuticalSupply({
        supplier_num: supply.supplier_num,
        name: supply.name,
        description: supply.description,
        dosage: supply.dosage,
        method_of_admin: supply.method_of_admin,
        quantity_in_stock: supply.quantity_in_stock,
        reorder_level: supply.reorder_level,
        cost_per_unit: supply.cost_per_unit
      });
      setShowCreateButton(false); // Hide the create button when a supply is selected
    }
  }

  return (
    <Paper sx={{ p: 5, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', ml: '60px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <TextField
            type="text"
            placeholder="Supplier Number"
            name="supplier_num"
            value={pharmaceuticalSupply.supplier_num}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Name"
            name="name"
            value={pharmaceuticalSupply.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Description"
            name="description"
            value={pharmaceuticalSupply.description}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Dosage"
            name="dosage"
            value={pharmaceuticalSupply.dosage}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Method of Administration"
            name="method_of_admin"
            value={pharmaceuticalSupply.method_of_admin}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Quantity in Stock"
            name="quantity_in_stock"
            value={pharmaceuticalSupply.quantity_in_stock}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Reorder Level"
            name="reorder_level"
            value={pharmaceuticalSupply.reorder_level}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Cost per Unit"
            name="cost_per_unit"
            value={pharmaceuticalSupply.cost_per_unit}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          {showCreateButton && ( // Render create button conditionally
            <Button type="submit" variant="contained" color="primary" sx={{ m: 1 }}>
              Create
            </Button>
          )}
          {selectedSupply && (
            <React.Fragment>
              <Button onClick={() => handleDelete(selectedSupply.drug_num)} variant="contained" color="secondary" sx={{ m: 1 }}>
                Delete
              </Button>
              <Button type="submit" variant="contained" color="primary" sx={{ m: 1 }}>
                Update
              </Button>
            </React.Fragment>
          )}
        </form>
        <Box sx={{ flexGrow: 1, p: 3, width: '100%' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Drug Number</th>
                <th>Supplier ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Dosage</th>
                <th>Method of Admin</th>
                <th>Quantity in stock</th>
                <th>Reorder Level</th>
                <th>Cost per Unit</th>
              </tr>
            </thead>
            <tbody>
              {pharmaceuticalSupplies.map((supply) => (
                <tr key={supply.drug_num} onClick={() => handleSelectSupply(supply)} style={{ backgroundColor: selectedSupply?.drug_num === supply.drug_num ? '#f0f0f0' : 'transparent' }}>
                  <td>{supply.drug_num}</td>
                  <td>{supply.supplier_num}</td>
                  <td>{supply.name}</td>
                  <td>{supply.description}</td>
                  <td>{supply.dosage}</td>
                  <td>{supply.method_of_admin}</td>
                  <td>{supply.quantity_in_stock}</td>
                  <td>{supply.reorder_level}</td>
                  <td>{supply.cost_per_unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Paper>
  );
};

const Surgical_NonSurgical = () => {
  const [surgical_and_nonsurgical, setSurgical_and_Nonsurgical] = useState([]);
  const [surgicalNonsurgical, setSurgicalNonsurgical] = useState({
    supplier_num: '',
    name: '',
    item_description: '',
    quantity_of_stocks: '',
    reorder_level: '',
    cost_per_unit: ''
  });
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [showCreateButton, setShowCreateButton] = useState(true);

  useEffect(() => {
    fetchSurgical_and_Nonsurgical();
  }, []);

  async function fetchSurgical_and_Nonsurgical() {
    const { data, error } = await supabase
      .from('surgical_and_non_surgical_supplies')
      .select('*');
    if (error) {
      console.error('Error fetching surgical and nonsurgical:', error);
    } else {
      setSurgical_and_Nonsurgical(data);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setSurgicalNonsurgical(prevSupply => ({
      ...prevSupply,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (selectedSupply) {
      // Update supply
      const { data, error } = await supabase
        .from('surgical_and_non_surgical_supplies')
        .update(surgicalNonsurgical)
        .eq('item_num', selectedSupply.item_num);
      if (error) {
        console.error('Error updating surgical and nonsurgical:', error);
      } else {
        setSurgical_and_Nonsurgical(prevSupplies =>
          prevSupplies.map(supply =>
            supply.item_num === selectedSupply.item_num ? { ...supply, ...surgicalNonsurgical } : supply
          )
        );
      }
    } else {
      // Create new supply
      const { data, error } = await supabase
        .from('surgical_and_non_surgical_supplies')
        .insert(surgicalNonsurgical)
        .select('*');
      if (error) {
        console.error('Error creating surgical and nonsurgical:', error);
      } else if (Array.isArray(data)) {
        setSurgical_and_Nonsurgical(prevSupplies => [...prevSupplies, ...data]);
      } else {
        console.error('Unexpected response data:', data);
      }
    }

    setSurgicalNonsurgical({
      supplier_num: '',
      name: '',
      item_description: '',
      quantity_of_stocks: '',
      reorder_level: '',
      cost_per_unit: ''
    });
    setSelectedSupply(null);
    setShowCreateButton(true); // Show the create button after form submission
  }

  async function handleDelete(item_num) {
    console.log('Deleting surgical and nonsurgical:', item_num);
    try {
      const { error } = await supabase
        .from('surgical_and_non_surgical_supplies')
        .delete()
        .eq('item_num', item_num);
      if (error) {
        console.error('Error deleting surgical and nonsurgical:', error);
      } else {
        // Update the supplies list after successful deletion
        setSurgical_and_Nonsurgical(prevSupplies => prevSupplies.filter(supply => supply.item_num !== item_num));
      }
    } catch (error) {
      console.error('Error deleting surgical and nonsurgical:', error.message);
    }

    // Reset form after deletion
    setSurgicalNonsurgical({
      supplier_num: '',
      name: '',
      item_description: '',
      quantity_of_stocks: '',
      reorder_level: '',
      cost_per_unit: ''
    });
    setSelectedSupply(null);
    setShowCreateButton(true); // Show the create button after deletion
  }

  function handleSelectSupply(supply) {
    if (selectedSupply && selectedSupply.item_num === supply.item_num) {
      // If the same supply is clicked again, deselect it
      setSurgicalNonsurgical({
        supplier_num: '',
        name: '',
        item_description: '',
        quantity_of_stocks: '',
        reorder_level: '',
        cost_per_unit: ''
      });
      setSelectedSupply(null);
      setShowCreateButton(true); // Show the create button after deselection
    } else {
      // Select the supply
      setSelectedSupply(supply);
      setSurgicalNonsurgical({
        supplier_num: supply.supplier_num,
        name: supply.name,
        item_description: supply.item_description,
        quantity_of_stocks: supply.quantity_of_stocks,
        reorder_level: supply.reorder_level,
        cost_per_unit: supply.cost_per_unit
      });
      setShowCreateButton(false); // Hide the create button when a supply is selected
    }
  }

  return (
    <Paper sx={{ p: 5, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', ml: '60px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <TextField
            type="text"
            placeholder="Supplier ID"
            name="supplier_num"
            value={surgicalNonsurgical.supplier_num}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Name"
            name="name"
            value={surgicalNonsurgical.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Item Description"
            name="item_description"
            value={surgicalNonsurgical.item_description}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Quantity in Stocks"
            name="quantity_of_stocks"
            value={surgicalNonsurgical.quantity_of_stocks}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Reorder Level"
            name="reorder_level"
            value={surgicalNonsurgical.reorder_level}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          <TextField
            type="text"
            placeholder="Cost per Unit"
            name="cost_per_unit"
            value={surgicalNonsurgical.cost_per_unit}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              style: { borderColor: 'black' }
            }}
            InputLabelProps={{
              style: { color: 'black' }
            }}
          />
          {showCreateButton && ( // Render create button conditionally
            <Button type="submit" variant="contained" color="primary" sx={{ m: 1 }}>
              Create
            </Button>
          )}
          {selectedSupply && (
            <React.Fragment>
              <Button onClick={() => handleDelete(selectedSupply.item_num)} variant="contained" color="secondary" sx={{ m: 1 }}>
                Delete
              </Button>
              <Button type="submit" variant="contained" color="primary" sx={{ m: 1 }}>
                Update
              </Button>
            </React.Fragment>
          )}
        </form>
        <Box sx={{ flexGrow: 1, p: 3, width: '100%' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Item Number</th>
                <th>Supplier ID</th>
                <th>Name</th>
                <th>Item Description</th>
                <th>Quantity in Stocks</th>
                <th>Reorder Level</th>
                <th>Cost per Unit</th>
              </tr>
            </thead>
            <tbody>
              {surgical_and_nonsurgical.map((supply) => (
                <tr key={supply.item_num} onClick={() => handleSelectSupply(supply)} style={{ backgroundColor: selectedSupply?.item_num === supply.item_num ? '#f0f0f0' : 'transparent' }}>
                  <td>{supply.item_num}</td>
                  <td>{supply.supplier_num}</td>
                  <td>{supply.name}</td>
                  <td>{supply.item_description}</td>
                  <td>{supply.quantity_of_stocks}</td>
                  <td>{supply.reorder_level}</td>
                  <td>{supply.cost_per_unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Paper>
  );
};

export default function Suppliers() {
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState({
    name: '', address: '', tel_number: '', fax_number: ''
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showCreateButton, setShowCreateButton] = useState(true);
  const suppliersRef = useRef(null);
  const pharmaceuticalRef = useRef(null);
  const surgicalRef = useRef(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*');
    
    if (error) {
      console.error('Error fetching suppliers:', error);
    } else {
      setSuppliers(data);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setSupplier(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (selectedSupplier) {
      // Update supplier
      const { data, error } = await supabase
        .from('suppliers')
        .update({
          name: supplier.name,
          address: supplier.address,
          tel_number: supplier.tel_number,
          fax_number: supplier.fax_number
        })
        .eq('supplier_num', selectedSupplier.supplier_num);

      if (error) {
        console.error('Error updating supplier:', error);
      } else {
        setSuppliers(prevSuppliers =>
          prevSuppliers.map(sup => 
            sup.supplier_num === selectedSupplier.supplier_num ? { ...sup, ...supplier } : sup
          )
        );
      }
    } else {
      // Create new supplier
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          name: supplier.name,
          address: supplier.address,
          tel_number: supplier.tel_number,
          fax_number: supplier.fax_number
        })
        .select('*');
    
      if (error) {
        console.error('Error creating supplier:', error);
      } else if (Array.isArray(data)) {
        setSuppliers(prevSuppliers => [...prevSuppliers, ...data]);
      } else {
        console.error('Unexpected response data:', data);
      }
    }

    setSupplier({ name: '', address: '', tel_number: '', fax_number: '' });
    setSelectedSupplier(null);
    setShowCreateButton(true); // Show the create button after form submission
    fetchSuppliers();
  }

  async function handleDelete(supplier_num) {
    console.log('Deleting supplier:', supplier_num);
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .delete()
        .eq('supplier_num', supplier_num);

      if (error) {
        console.error('Error deleting supplier:', error);
      } else {
        // Update the suppliers list after successful deletion
        setSuppliers(prevSuppliers => prevSuppliers.filter(sup => sup.supplier_num !== supplier_num));
      }
    } catch (error) {
      console.error('Error deleting supplier:', error.message);
    }

    // Reset form after deletion
    setSupplier({ name: '', address: '', tel_number: '', fax_number: '' });
    setSelectedSupplier(null);
    setShowCreateButton(true); // Show the create button after deletion
  }

  function handleSelectSupplier(supplier) {
    if (selectedSupplier && selectedSupplier.supplier_num === supplier.supplier_num) {
      // If the same supplier is clicked again, deselect it
      setSupplier({ name: '', address: '', tel_number: '', fax_number: '' });
      setSelectedSupplier(null);
      setShowCreateButton(true); // Show the create button after deselection
    } else {
      // Select the supplier
      setSelectedSupplier(supplier);
      setSupplier({
        name: supplier.name,
        address: supplier.address,
        tel_number: supplier.tel_number,
        fax_number: supplier.fax_number
      });
      setShowCreateButton(false); // Hide the create button when a supplier is selected
    }
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
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
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Button variant="outlined" onClick={() => scrollToSection(suppliersRef)}>Suppliers</Button>
              <Button variant="outlined" onClick={() => scrollToSection(pharmaceuticalRef)}>Pharmaceutical</Button>
              <Button variant="outlined" onClick={() => scrollToSection(surgicalRef)}>Surgical/Non-Surgical</Button>
            </Stack>
            <Box ref={suppliersRef}>
              <Typography variant="h4" component="h2" gutterBottom>
                Suppliers
              </Typography>
              <Paper sx={{ p: 5, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      <TextField
                        type="text"
                        placeholder="Supplier Name"
                        name='name'
                        value={supplier.name}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ m: 1 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"></InputAdornment>,
                          style: { borderColor: 'black' }
                        }}
                        InputLabelProps={{
                          style: { color: 'black' }
                        }}
                      />
                      <TextField
                        type="text"
                        placeholder="Address"
                        name='address'
                        value={supplier.address}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ m: 1 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"></InputAdornment>,
                          style: { borderColor: 'black' }
                        }}
                        InputLabelProps={{
                          style: { color: 'black' }
                        }}
                      />
                      <TextField
                        type="text"
                        placeholder="Telephone Number"
                        name='tel_number'
                        value={supplier.tel_number}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ m: 1 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"></InputAdornment>,
                          style: { borderColor: 'black' }
                        }}
                        InputLabelProps={{
                          style: { color: 'black' }
                        }}
                      />
                      <TextField
                        type="text"
                        placeholder="Fax Number"
                        name='fax_number'
                        value={supplier.fax_number}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ m: 1 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"></InputAdornment>,
                          style: { borderColor: 'black' }
                        }}
                        InputLabelProps={{
                          style: { color: 'black' }
                        }}
                      />
                      {showCreateButton && ( // Render create button conditionally
                        <Button type='submit' variant='contained' color='primary' sx={{ m: 1 }}>
                          Create
                        </Button>
                      )}
                      {selectedSupplier && (
                        <React.Fragment>
                          <Button onClick={() => handleDelete(selectedSupplier.supplier_num)} variant='contained' color='secondary' sx={{ m: 1 }}>
                            Delete
                          </Button>
                          <Button type='submit' variant='contained' color='primary' sx={{ m: 1 }}>
                            Update
                          </Button>
                        </React.Fragment>
                      )}
                    </form>
                  </Grid>
                  <Grid item xs={12}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Supplier ID</th>
                          <th>Supplier Name</th>
                          <th>Address</th>
                          <th>Telephone</th>
                          <th>Fax Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map((supplier) => (
                          <tr key={supplier.supplier_num} onClick={() => handleSelectSupplier(supplier)} style={{ backgroundColor: selectedSupplier?.supplier_num === supplier.supplier_num ? '#f0f0f0' : 'transparent' }}> 
                            <td>{supplier.supplier_num}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.address}</td>
                            <td>{supplier.tel_number}</td>
                            <td>{supplier.fax_number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
            <Box ref={pharmaceuticalRef} sx={{ mt: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Pharmaceutical
              </Typography>
              <PharmaceuticalSuppliesPage />
            </Box>
            <Box ref={surgicalRef} sx={{ mt: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Surgical/Non-Surgical
              </Typography>
              <Surgical_NonSurgical />
            </Box>
          </Container>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
