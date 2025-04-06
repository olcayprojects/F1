import { useEffect } from "react";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DriverId = ({ setDrivers, season }) => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/${season}/drivers.json`);
      const data = await response.json();

      setDrivers(data.MRData.DriverTable.Drivers);
    };

    fetchData();
  }, [setDrivers, season]);
};

export default DriverId;
