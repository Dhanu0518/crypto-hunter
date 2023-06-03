import { makeStyles } from "@material-ui/core";
// import Homepage from "./Pages/HomePage";
import Homepage from "./Pages/Homepage";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import CoinPage from "./Pages/CoinPage";
// import Header from "./components/Header";
import Header from "./Components/Header";
import Alert from "./Components/Alert";
import Chat from "./Components/Chat/Chat";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#02103d",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Route path="/" component={Homepage} exact />
        <Route path="/crypto-hunter" component={Homepage} exact />
        <Route path="/coins/:id" component={CoinPage} exact />
        <Route path="/crypto-hunter/coins/:id" component={CoinPage} exact />
      </div>
      <Alert />
      <Chat />
    </BrowserRouter>
  );
}

export default App;
