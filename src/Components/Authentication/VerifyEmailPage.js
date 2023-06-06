import { useEffect } from "react";
import { auth } from "../firebase";
import { CircularProgress, Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: theme.palette.common.white,
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    fontSize: "1.5rem",
    textAlign: "center",
  },
  message: {
    fontSize: "1rem",
    textAlign: "center",
  },
  progress: {
    marginTop: theme.spacing(2),
    color: "#EEBC1D",
  },
}));

const VerifyEmailPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const checkEmailVerification = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) {
          // Reload the user to update the email verification status
          user.reload().then(() => {
            if (user.emailVerified) {
              // Email is verified, redirect to the desired page

              history.push("/");
            } else {
            }
          });
        } else {
          // Email is already verified, redirect to the desired page

          history.push("/");
        }
      }
    });
  };

  useEffect(() => {
    checkEmailVerification();
  }, []); // Empty dependency array

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        Please verify your email address.
      </Typography>
      <Typography variant="body1" className={classes.message} gutterBottom>
        A verification email has been sent to your email address. Please click
        the verification link to complete the signup process.
      </Typography>
      <CircularProgress className={classes.progress} />
    </Box>
  );
};

export default VerifyEmailPage;
