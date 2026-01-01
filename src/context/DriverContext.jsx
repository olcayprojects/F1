import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);
  const [season, setSeason] = useState("2026");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${season}/drivers.json`);
        const data = await response.json();
        setDrivers(data.MRData.DriverTable.Drivers);
      } catch (error) {
        console.error("Sürücüler alınamadı:", error);
      }
    };

    fetchDrivers();
  }, [season]);

  return (
    <DriverContext.Provider value={{ drivers, setSeason, season }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDrivers = () => useContext(DriverContext);
