import { Box, Button, TextField } from "@material-ui/core";
import { useState, useEffect } from "react";
import { CryptoState } from "../../CryptoContext";
import { auth } from "./../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);
  const { setAlert } = CryptoState();
  const history = useHistory();

  useEffect(() => {
    // Check if the email verification action is triggered
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const actionCode = urlParams.get("oobCode");

    if (mode === "verifyEmail" && actionCode) {
      setLoading(true);

      // Verify the email action code
      auth
        .applyActionCode(actionCode)
        .then(() => {
          setAlert({
            open: true,
            message:
              "Email verification successful. Please proceed to sign up.",
            type: "success",
          });
          setLoading(false);
        })
        .catch((error) => {
          setAlert({
            open: true,
            message: error.message,
            type: "error",
          });
          setLoading(false);
        });
    }
  }, []);

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
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      await updateProfile(user, {
        displayName: displayName,
      });

      await sendEmailVerification(user);

      onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
          setAlert({
            open: true,
            message: `Sign Up Successful. Your email has been verified. Welcome ${user.displayName}`,
            type: "success",
          });
          handleClose();
        } else {
          setAlert({
            open: true,
            message:
              "Sign Up Successful. Please check your email for verification.",
            type: "success",
          });
          setLoading(false);
          history.push("/verify-email");
        }
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      setLoading(false);
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
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign Up"}
      </Button>
    </Box>
  );
};

export default Signup;
