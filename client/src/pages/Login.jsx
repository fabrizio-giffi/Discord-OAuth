import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { red } from "@mui/material/colors";

const auth_URL = import.meta.env.VITE_AUTH_URL;

function Login() {
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSpinning(true);
    const requestBody = { email, password };
    try {
      const response = await axios.post(`${auth_URL}/login`, requestBody);
      // response.data.authToken holds the token
      setIsSpinning(false);
      storeToken(response.data.authToken);
      await authenticateUser();
      navigate("/");
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
      setIsSpinning(false);
      console.log("There was an error with the login.", errorDescription);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              id="email"
              type="email"
              required
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              autoFocus
            />
            <FormControl required fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, position: "relative" }}>
                Log In
              </Button>
              {isSpinning && (
                <CircularProgress size={20} sx={{ color: "white", position: "absolute", ml: 15, mt: 1 }} />
              )}
            </Box>
          </Box>
        </Box>
        {errorMessage && (
          <Stack
            sx={{
              color: "white",
              bgcolor: red[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              height: "35px",
            }}
          >
            <Typography>{errorMessage}</Typography>
          </Stack>
        )}
        <Stack
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          direction="row"
        >
          <Typography>Don't have an account yet?</Typography>
          <Link to={"/signup"}>Sign Up</Link>
        </Stack>
      </Container>
    </>
  );
}

export default Login;
