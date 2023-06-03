import { Box, Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { CryptoState } from "../../CryptoContext";
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  signup: {
    backgroundColor: "#EEBC1D",
    transition: "0.5s ease",
    "&:hover": {
      backgroundColor: "#032369",
      fontWeight: "bold",
      color: "white",
    },
  },
});
const Signup = ({ handleClose }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const { setAlert } = CryptoState();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      const profile = await updateProfile(user, {
        displayName: displayName,
      });
      console.log(profile);

      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.displayName}`,
        type: "success",
      });
      handleClose();
    } catch (error) {
      setAlert({
        open: true,
        message: "Email already exist",
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
        type="text"
        label="Enter your name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        fullWidth
      />
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
      <TextField
        variant="outlined"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        size="large"
        className={classes.signup}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;
