import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import supabase from '../Services/Supabase';

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
      setSurgicalNonsurgical(supply);
      setSelectedSupply(supply);
      setShowCreateButton(false); // Hide the create button when a supply is selected
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', ml: '60px' }}>
      <Box sx={{ width: '90%', mb: 2 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <TextField
            type="text"
            placeholder="Supplier ID"
            name="supplier_num"
            value={surgicalNonsurgical.supplier_num}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
          />
          <TextField
            type="text"
            placeholder="Name"
            name="name"
            value={surgicalNonsurgical.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
          />
          <TextField
            type="text"
            placeholder="Item Description"
            name="item_description"
            value={surgicalNonsurgical.item_description}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
          />
          <TextField
            type="text"
            placeholder="Quantity in Stocks"
            name="quantity_of_stocks"
            value={surgicalNonsurgical.quantity_of_stocks}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
          />
          <TextField
            type="text"
            placeholder="Reorder Level"
            name="reorder_level"
            value={surgicalNonsurgical.reorder_level}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
          />
          <TextField
            type="text"
            placeholder="Cost per Unit"
            name="cost_per_unit"
            value={surgicalNonsurgical.cost_per_unit}
            onChange={handleChange}
            variant="outlined"
            sx={{ m: 1 }}
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
      </Box>
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
  );
};

export default Surgical_NonSurgical;