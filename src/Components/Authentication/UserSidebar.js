import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Avatar, Button } from "@material-ui/core";
import { CryptoState } from "../../CryptoContext";
import { signOut } from "firebase/auth";
import { auth, db } from "./../firebase";
import { numberWithCommas } from "./../CoinsTable";
import { AiFillDelete } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
// import EditProfile from "./../EditProfile";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
    backgroundColor: "#797cba",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "8%",
    width: "100%",
    backgroundColor: "#EEBC1D",
    marginTop: 20,
    transition: "0.5s ease",
    "&:hover": {
      backgroundColor: "#032369",
      fontWeight: "bold",
      color: "white",
    },
  },
  picture: {
    width: 200,
    fontSize: 100,
    height: 200,
    cursor: "pointer",
    backgroundColor: "#232bc2",
    objectFit: "contain",
    color: "#c3bad1",
  },
  picture_displayname: {
    width: 200,
    height: 200,
    fontSize: 102,
    cursor: "pointer",
    backgroundColor: "#232bc2",
    objectFit: "contain",
    fontWeight: 500,
    fontFamily: "monospace",
    color: "#e7e6e8",
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "#131b42",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll",
  },
  watchlist1: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "80px",
    textTransform: "uppercase",
    color: "#666",
    fontSize: "1rem",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#7787a8",
    boxShadow: "0 0 3px black",
  },
  formContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  formButton: {
    width: "100%",
    marginTop: 10,
  },
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  console.log(watchlist, coins);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const history = useHistory();

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successfull !",
    });

    toggleDrawer();
  };

  const handleCoinClick = (item) => {
    toggleDrawer(false);
    history.push(`/crypto-hunter/coins/${item}`);
    window.location.reload();
  };
  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const handleEditProfileOpen = () => {
    toggleDrawer(false);
    history.push("/crypto-hunter/edit-profile");
  };

  // const handleEditProfileClose = () => {
  //   history.push("/crypto-hunter");
  // };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor} style={{ backgroundColor: "#797cba" }}>
          {user.photoURL ? (
            <Avatar
              onClick={toggleDrawer(anchor, true)}
              style={{
                height: 38,
                width: 38,
                marginLeft: 15,
                cursor: "pointer",
                backgroundColor: "#232bc2",
                color: "#c3bad1",
              }}
              src={user.photoURL}
              alt={user.displayName || user.email}
            />
          ) : (
            <Avatar
              onClick={toggleDrawer(anchor, true)}
              style={{
                height: 38,
                width: 38,
                marginLeft: 15,
                fontWeight: "bold",
                cursor: "pointer",
                backgroundColor: "#232bc2",
                color: "#c3bad1",
                textDecoration: "italic",
              }}
              src={user.displayName}
              alt={user.displayName || user.email}
            />
          )}

          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                {user.photoURL ? (
                  <Avatar
                    className={classes.picture}
                    src={user.photoURL}
                    alt={user.displayName || user.email}
                  />
                ) : (
                  <Avatar
                    className={classes.picture_displayname}
                    src={user.displayName}
                    alt={user.displayName || user.email}
                  />
                )}

                <span
                  style={{
                    width: "100%",
                    fontSize: 18,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className={classes.formContainer}>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.formButton}
                    onClick={handleEditProfileOpen}
                  >
                    Edit Profile
                  </Button>
                </div>
                {watchlist.length > 0 ? (
                  <div className={classes.watchlist}>
                    <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                      Watchlist
                    </span>
                    {coins.map((coin) => {
                      if (watchlist.includes(coin.id))
                        return (
                          <div className={classes.coin}>
                            <span
                              onClick={() => handleCoinClick(coin.id)}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {coin.name}
                            </span>
                            <span
                              style={{
                                display: "flex",
                                gap: 8,
                                cursor: "pointer",
                              }}
                            >
                              {symbol}{" "}
                              {numberWithCommas(coin.current_price.toFixed(2))}
                              <AiFillDelete
                                style={{ cursor: "pointer" }}
                                fontSize="16"
                                onClick={() => removeFromWatchlist(coin)}
                              />
                            </span>
                          </div>
                        );
                      else return <></>;
                    })}
                  </div>
                ) : (
                  <div className={classes.watchlist}>
                    <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                      Watchlist
                    </span>
                    <div className={classes.watchlist1}>
                      your watchlist is empty
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
