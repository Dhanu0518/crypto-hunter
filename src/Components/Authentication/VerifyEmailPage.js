import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { CircularProgress, Typography, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { CryptoState } from "../../CryptoContext";

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
  email: {
    color: "gold",
    fontWeight: "500",
  },
  resendButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "gold",
    color: "black",
    fontWeight: "500",
    transition: "0.5s ease",
    "&:hover": {
      backgroundColor: "#273e70",
      border: "none",
      outline: "none",
      color: "white",
    },
    "&:disabled": {
      backgroundColor: "#999",
      color: "#666",
    },
  },
}));

const VerifyEmailPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const { user } = CryptoState();

  const checkEmailVerification = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) {
          // Reload the user to update the email verification status
          user.reload().then(() => {
            if (user.emailVerified) {
              // Email is verified, redirect to the desired page
              history.push("/");
            }
          });
        } else {
          // Email is already verified, redirect to the desired page
          history.push("/");
        }
      }
    });
  };

  const handleResendVerification = () => {
    if (!canResend) {
      return; // Do nothing if resend is not allowed yet
    }

    setIsResending(true);
    setCanResend(false);

    const user = auth.currentUser;
    sendEmailVerification(user)
      .then(() => {
        setIsResending(false);
        console.log("Verification email sent.");
      })
      .catch((error) => {
        setIsResending(false);
        console.log("Error sending verification email:", error);
      });
  };

  useEffect(() => {
    checkEmailVerification();

    if (canResend) {
      setCountdown(30); // Reset countdown when resending is allowed
    }

    // Allow resending after 30 seconds
    const resendInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          setCanResend(true);
          clearInterval(resendInterval);
          return 0;
        }
      });
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(resendInterval);
  }, [canResend]);

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        Please verify your email address.
      </Typography>
      <Typography variant="body1" className={classes.message} gutterBottom>
        A verification email has been sent to
        <b className={classes.email}> {user.email}</b>. <br />
        Please click the verification link to complete the signup process.
      </Typography>
      {isResending ? (
        <CircularProgress className={classes.progress} />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleResendVerification}
          className={classes.resendButton}
          disabled={!canResend}
        >
          {canResend ? "Resend Verification Email" : `Resend in ${countdown}s`}
        </Button>
      )}
    </Box>
  );
};

export default VerifyEmailPage;
