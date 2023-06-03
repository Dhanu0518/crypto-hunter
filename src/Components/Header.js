import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import AuthModal from "./Authentication/AuthModal";
// import Login from "./Authentication/Login";
import UserSidebar from "./Authentication/UserSidebar";
const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    color: "gold",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const Header = () => {
  const classes = useStyles();
  const { currency, setCurrency, user } = CryptoState();
  console.log(currency);

  const history = useHistory();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography
              onClick={() => history.push(`/crypto-hunter`)}
              variant="h6"
              className={classes.title}
            >
              <img
                src="https://www.logolynx.com/images/logolynx/ba/bad47cfe17cc0f9a54c760f1c668bb01.png"
                alt="logo"
                style={{
                  backgroundColor: "none",
                  width: "40px",
                  height: "40px",
                }}
              />
              <h6
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginLeft: "10px",
                }}
              >
                CryptoTracker
              </h6>
            </Typography>
            {/* <Button color="inherit">Login</Button> */}
            <Select
              variant="outlined"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currency}
              style={{
                width: 100,
                height: 40,
                marginLeft: 30,
              }}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>IND</MenuItem>
            </Select>
            {user ? <UserSidebar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
