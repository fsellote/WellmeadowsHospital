import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import supabase from '../Services/Supabase';

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
    setShowCreateButton(true); 
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
       
        setPharmaceuticalSupplies(prevSupplies => prevSupplies.filter(supply => supply.drug_num !== drug_num));
      }
    } catch (error) {
      console.error('Error deleting pharmaceutical supply:', error.message);
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
    setShowCreateButton(true); 
  }

  function handleSelectSupply(supply) {
    if (selectedSupply && selectedSupply.drug_num === supply.drug_num) {
    
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
      setShowCreateButton(true); 
    } else {
      
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
      setShowCreateButton(false); 
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
          {showCreateButton && (
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

export default PharmaceuticalSuppliesPage;
