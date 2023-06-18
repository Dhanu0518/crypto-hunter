import React from "react";
import Banner from "../Components/Banner/Banner";
import CoinsTable from "../Components/CoinsTable";
import Header from "../Components/Header";
function Homepage() {
  return (
    <>
      <div>
        <Header />

        <Banner />
        <CoinsTable />
      </div>
    </>
  );
}

export default Homepage;
