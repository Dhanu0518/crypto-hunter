import { Box, Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../firebase"; // Update the import statement
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { AppBar } from "@material-ui/core";

import Fade from "@material-ui/core/Fade";
const useStyles = makeStyles((theme) => ({
  login: {
    backgroundColor: "#EEBC1D",
    transition: "0.5s ease",
    "&:hover": {
      backgroundColor: "#032369",
      fontWeight: "bold",
      color: "white",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    color: "white",
    borderRadius: 10,
  },
  forgot: {
    position: "relative",
    width: "max-content",
    cursor: "pointer",
    transition: "0.9s ease",
    "&:hover": {
      color: "#EEBC1D",

      "&::before": {
        transform: "scaleX(1)",
        transformOrigin: "left",
      },
    },
    "&::before": {
      content: '""',
      position: "absolute",
      bottom: -1,
      left: 0,
      width: "100%",
      height: "2px",
      backgroundColor: "#EEBC1D",
      transform: "scaleX(0)",
      transition: "transform 0.9s ease",
    },
  },
}));
const Login = ({ handleClose, handleOpen }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [femail, setFemail] = useState("");
  const [password, setPassword] = useState("");

  const { setAlert } = CryptoState();
  const [open, setOpen] = useState(false);

  const handleCloseForgot = () => {
    setOpen(false);
  };
  const handleResetPassword = async () => {
    if (!femail) {
      setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }
    try {
      sendPasswordResetEmail(auth, femail); // Use the `auth` object for sending password reset email
      setAlert({
        open: true,
        message: "Password reset email sent. Please check your inbox.",
        type: "success",
      });

      handleCloseForgot();
    } catch (error) {
      setAlert({
        open: true,
        message: `Error: ${error.message}`,
        type: "error",
      });
      return;
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      setAlert({
        open: true,
        message: `Login Successful. Welcome ${result.user.displayName}`,
        type: "success",
      });

      handleClose();
    } catch (error) {
      setAlert({
        open: true,
        message: "Please Enter the valid combination of email and password",
        type: "error",
      });
      return;
    }
  };
  const handleforgot = () => {
    setOpen(true);
  };

  return (
    <>
      <Box
        p={3}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <TextField
          variant="outlined"
          type="email"
          label="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Enter Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <label
          variant="contained"
          size="large"
          onClick={() => handleforgot()}
          className={classes.forgot}
        >
          forgot password ?
        </label>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          className={classes.login}
        >
          Login
        </Button>
      </Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => handleCloseForgot()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Box
                p={3}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <TextField
                  variant="outlined"
                  type="email"
                  label="Enter Email"
                  value={femail}
                  onChange={(e) => setFemail(e.target.value)}
                  fullWidth
                />

                <Button
                  variant="contained"
                  size="large"
                  className={classes.login}
                  onClick={handleResetPassword}
                >
                  Submit
                </Button>
              </Box>
            </AppBar>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default Login;
