import React from "react";
import { useGlobalContext } from "../context/Context";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 2, 0),
  },
  signup: {
    // marginTop: theme.spacing(1),
    margin: theme.spacing(0, 0, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function LoginDialogue({ open, handleClose }) {
  const classes = useStyles();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [createAccount, setCreateAccount] = React.useState(false);
  const [alert, setAlert] = React.useState({ show: false, type: "", msg: "" });

  const { loggedIn, logIn, createNewUser } = useGlobalContext();

  const stateResetandClose = React.useCallback(() => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setCreateAccount(false);
    setAlert({ show: false, type: "", msg: "" });
    handleClose();
  }, [handleClose]);

  React.useEffect(() => {
    if (loggedIn === true) {
      stateResetandClose();
    }
  }, [loggedIn, stateResetandClose]);

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const clickOutsiteHandler = () => {
    // function inhereted from navbar
    stateResetandClose();
  };

  const loginHandler = (e) => {
    e.preventDefault();
    logIn(username, password);
    if (loggedIn) {
      stateResetandClose();
    }
  };

  const createHandler = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      createNewUser(username, password);
    }
    if (loggedIn) {
      stateResetandClose();
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={clickOutsiteHandler}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          {createAccount ? (
            <Typography component="h1" variant="h5">
              Create Account
            </Typography>
          ) : (
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
          )}
          {alert.show && (
            <Alert onClose={() => showAlert()}>
              This is a success alert — check it out!
            </Alert>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="User Name"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {createAccount && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              autoComplete="current-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          {createAccount ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={createHandler}
            >
              Create Account
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={loginHandler}
            >
              Sign In
            </Button>
          )}
        </DialogActions>
        {createAccount ? (
          <Link
            href="#"
            variant="body2"
            className={classes.signup}
            onClick={() => {
              setCreateAccount(false);
            }}
          >
            {"Cancel"}
          </Link>
        ) : (
          <Link
            href="#"
            variant="body2"
            className={classes.signup}
            onClick={() => {
              setCreateAccount(true);
            }}
          >
            {"Don't have an account? Sign Up"}
          </Link>
        )}
      </Dialog>
    </div>
  );
}
