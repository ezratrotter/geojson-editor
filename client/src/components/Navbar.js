import React from "react";
import Login from "./LoginDialogue";
import { useGlobalContext } from "../context/Context";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Navbar() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { loggedIn, logOut, submitGeometries } = useGlobalContext();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            GeoJSON editor
          </Typography>
          {loggedIn ? (
            <>
              <Button
                color="secondary"
                variant="contained"
                onClick={submitGeometries}
              >
                Submit
              </Button>
              <Button color="inherit" onClick={logOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleClickOpen}
              >
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Login open={open} handleClose={handleClose} />
    </>
  );
}

export default Navbar;
