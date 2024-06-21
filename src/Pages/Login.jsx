import React, { useState } from 'react';
import { Container, Box, Paper, TextField, Button, Typography, InputAdornment, IconButton, Grid, CssBaseline, Avatar } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import supabase from '../Services/Supabase';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import your local image
import backgroundImage from '../assets/wellm.png';

const defaultTheme = createTheme();

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false); 
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("something went wrong");

  const login = async () => {
    console.log("Attempting to log in...");
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      console.log("Supabase response:", data, error);
      
      if (error) {
        setIsError(true);
        setErrorMessage(error.message);
        console.error("Login error:", error.message);
      } else if (data) {
        if (data.user) {
          navigate("/dashboard");
        } else {
          setIsError(true);
          setErrorMessage("Invalid email or password");
        }
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage("Failed to fetch");
      console.error("Network or server error:", err);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '@media (max-width: 600px)': {
            backgroundSize: 'contain',
          },
        }}
      />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ backgroundColor: '#0000' }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            {isError && (
              <Box>
                <Typography color="red" align="center">{errorMessage}</Typography>
              </Box>
            )}
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={login}
                endIcon={<LoginOutlinedIcon />}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
