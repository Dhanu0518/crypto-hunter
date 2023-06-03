import { Box, Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { auth } from "./../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  login: {
    backgroundColor: "#EEBC1D",
    transition: "0.5s ease",
    "&:hover": {
      backgroundColor: "#032369",
      fontWeight: "bold",
      color: "white",
    },
  },
});
const Login = ({ handleClose }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAlert } = CryptoState();

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

  return (
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
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        className={classes.login}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
