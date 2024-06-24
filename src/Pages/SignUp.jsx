import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper, Box, Link as MuiLink, Avatar, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import supabase from '../Services/Supabase';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          }
        }
      });

      if (error) throw error;

      alert("Sign up successful. You can now log in.");
      navigate('/'); // Redirect to login page
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "95vh", justifyContent: "center" }}>
      <Container maxWidth="xs" component={Paper} sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
          </Box>
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                variant="outlined"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                variant="outlined"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I agree to the Terms & Privacy Policy."
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign Up
              </Button>
            </Grid>
            <Grid xs={12} container justifyContent="flex-end">
              <Grid item>
                <MuiLink component={Link} to="/" variant="body2">
                  Already have an account? Sign in
                </MuiLink>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
}

export default SignUp;
