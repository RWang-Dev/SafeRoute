import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import CrimeMap from "./components/CrimeMap";
import Home from "./routes/Home";
import ErrorPage from "./routes/ErrorPage";
import Locations from "./components/Locations";
import LocationEdit from "./components/LocationEdit";
import AdminInterface from "./components/AdminInterface";

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.PUBLIC_URL}/clustered_data.json`
                    // `${process.env.PUBLIC_URL}/Google_UMPD_Daily_Crime_Aggregated_with_Location.json`
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
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<CrimeMap data={data} loading={loading} />} />
                <Route path="/locations/:loc_id" element={<LocationEdit />}></Route>
                <Route path="/locations" element={<Locations />}></Route>
                <Route path="/admin" element={<AdminInterface />}></Route>
                <Route path="*" element={<ErrorPage />}></Route>
            </Routes>
        </div>
    );
}

export default App;
