import React, { useState } from "react";
import { TextField, Button, Avatar } from "@material-ui/core";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "./firebase";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { makeStyles } from "@material-ui/core/styles";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "300px",
    margin: "0 auto",
  },
  label: {
    fontWeight: "bold",
  },
  displayName: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "gold",
    marginBottom: "1rem",
    textTransform: "capitalize",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#EEBC1D",
    color: "black",
    fontWeight: "600",
    transition: "0.5s ease",
    "&:hover": {
      backgroundColor: "#032369",
      fontWeight: "600",
      color: "white",
    },
  },
  close: {
    backgroundColor: "#ff0000",
    color: "black",
    fontWeight: "500",
    transition: "0.5s ease",
    "&:hover": {
      backgroundColor: "#b84659",
      fontWeight: "500",
      color: "black",
    },
  },
  update: {
    backgroundColor: "#0000ff",
    color: "black",
    fontWeight: "500",
    transition: "0.5s ease",
    "&:hover": {
      backgroundColor: "#4343cc",
      fontWeight: "500",
      color: "black",
    },
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: "0 auto",
  },
  textField: {
    width: "100%",
  },
  fileInput: {
    display: "none",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
}));

const EditProfile = () => {
  const classes = useStyles();
  const { setAlert, user } = CryptoState();
  const [displayName, setDisplayName] = useState("");
  const [profileError, setProfileError] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null); // New state for profile picture URL
  const history = useHistory();

  const handleProfileUpdate = async () => {
    try {
      // Validate display name
      if (!displayName) {
        setProfileError("Display Name is required.");
        return;
      }

      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: profilePictureURL || user.photoURL, // Use the profile picture URL if available, otherwise use the existing photoURL
      });

      if (profilePicture) {
        const storageRef = ref(
          storage,
          `profilePictures/${auth.currentUser.uid}`
        );
        await uploadBytes(storageRef, profilePicture);

        const pictureURL = await getDownloadURL(storageRef);
        // Set the profile picture URL state
        setProfilePictureURL(pictureURL);

        // Update the user's photoURL with the profile picture URL
        await updateProfile(auth.currentUser, {
          photoURL: pictureURL,
        });
      }

      setAlert({
        open: true,
        type: "success",
        message: "Profile updated successfully!",
      });

      history.push("/");
    } catch (error) {
      setProfileError(error.message);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        storageRef.getDownloadURL().then((downloadURL) => {
          console.log("File uploaded successfully. Download URL:", downloadURL);
          setProfilePictureURL(downloadURL);
        });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleCancel = () => {
    history.push("/"); // Redirect to home page when canceling profile update
  };

  return (
    <div className={classes.container}>
      <div className={classes.avatarContainer}>
        <Avatar
          className={classes.avatar}
          src={profilePictureURL || user.photoURL} // Use the profile picture URL if available, otherwise use the existing photoURL
          alt="Profile Picture"
        />
      </div>
      <div className={classes.displayName}>{user.displayName}'s Profile</div>
      <label className={classes.label}>Display Name</label>
      <TextField
        className={classes.textField}
        variant="outlined"
        value={displayName}
        placeholder={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <label className={classes.label}>Profile Picture</label>
      <input
        className={classes.fileInput}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
      />
      <Button
        variant="contained"
        color="primary"
        component="label"
        htmlFor="profile-picture-input"
        className={classes.button}
      >
        Select Picture
      </Button>
      <input
        id="profile-picture-input"
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCancel}
          className={classes.close}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleProfileUpdate}
          className={classes.update}
        >
          Update Profile
        </Button>
      </div>
      {profileError && <div>{profileError}</div>}
    </div>
  );
};

export default EditProfile;
