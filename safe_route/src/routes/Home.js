import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      {/* <h2>Incident Location: {selectedCrime["Incident Location"]}</h2> */}
      <Link to="/map">Go to map page </Link>
    </div>
  );
}

export default Home;
