import React from "react";
import Banner from "../Components/Banner/Banner";
import CoinsTable from "../Components/CoinsTable";
import Chat from "../Components/Chat/Chat";

function Homepage() {
  return (
    <>
      <Banner />
      <Chat />

      <CoinsTable />
    </>
  );
}

export default Homepage;
