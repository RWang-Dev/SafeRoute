// App.js
import React, { useState, useEffect } from "react";
import CrimeMap from "./CrimeMap"; // Ensure this is the correct path to your CrimeMap component
import crimeData from "./UMPD_Daily_Crime_Aggregated_with_Location.json"; // The path to your JSON file

function App() {
  // State to store your data
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(crimeData);
  }, []);

  return (
    <div className="App">
      <CrimeMap data={data} />
    </div>
  );
}

export default App;
