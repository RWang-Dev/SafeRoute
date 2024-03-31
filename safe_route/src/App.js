import React, { useState, useEffect } from "react";
import CrimeMap from "./CrimeMap";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/Google_UMPD_Daily_Crime_Aggregated_with_Location.json`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error loading crime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("App component rendered.");

  return (
    <div className="App">
      {loading ? <div>Loading...</div> : <CrimeMap data={data} />}
    </div>
  );
}

export default App;
