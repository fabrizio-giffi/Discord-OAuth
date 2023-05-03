import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { NavLink } from "react-router-dom";
import { Box, List, Typography } from "@mui/material";

function NavBar() {
  const { isLoggedIn, logOutUser, user } = useContext(AuthContext);
  return (
    <Box component="nav">
      <List sx={{ display: "flex", gap: 3, p: 2, justifyContent: "end", bgcolor: "slategray" }}>
        <NavLink to="/signup">
          <Typography>Signup</Typography>
        </NavLink>
        <NavLink to="/login">
          <Typography>Login</Typography>
        </NavLink>
        <NavLink to="/" onClick={logOutUser}>
          <Typography>Logout</Typography>
        </NavLink>
      </List>
    </Box>
  );
}

export default NavBar;
