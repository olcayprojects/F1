import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import DriverId from "./DriverId";
import Loading from "./Loading";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const timeToSeconds = (time) => {
  const [minutes, seconds] = time.split(":");
  const [sec, ms] = seconds.split(".");
  return parseFloat(minutes) * 60 + parseFloat(sec) + parseFloat(ms) / 1000;
};

const ApiDataComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [raceDetails, setRaceDetails] = useState(null);
  const itemsPerPage = 100;

  const [drivers, setDrivers] = useState([]);

  const { season, rounds = "1" } = useParams();

  const apiUrl = `${BASE_URL}/${season}/${rounds}/laps.json`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let allData = [];
      let total = 0;
      try {
        const response = await axios.get(apiUrl, {
          params: {
            limit: itemsPerPage,
            offset: 0,
          },
        });

        total = response.data.MRData.total;

        const raceInfo = response.data.MRData.RaceTable.Races[0];
        setRaceDetails(raceInfo);

        let totalPages = Math.ceil(total / itemsPerPage);
        for (let i = 0; i < totalPages; i++) {
          const pageResponse = await axios.get(apiUrl, {
            params: {
              limit: itemsPerPage,
              offset: i * itemsPerPage,
            },
          });

          const raceData = pageResponse.data.MRData.RaceTable.Races[0];
          if (raceData && raceData.Laps) {
            allData = [
              ...allData,
              ...raceData.Laps.map((lap) => ({
                raceName: raceData.raceName,
                laps: lap,
              })),
            ];
          }
        }

        allData = allData.map((item) => {
          const { raceName, laps } = item;
          laps.Timings = laps.Timings.map((timing) => ({
            ...timing,
            timeInSeconds: timeToSeconds(timing.time),
            lapNumber: laps.number,
            raceName: raceName,
          }));
          return laps.Timings;
        });

        allData = allData
          .flat()
          .sort((a, b) => a.timeInSeconds - b.timeInSeconds);

        setData(allData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Veri alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.log("Error:", error);
    return <div>{error}</div>;
  }

  return (
    <div className="container-fluid p-0">
      <Nav />
      <DriverId setDrivers={setDrivers} season={season} />

      <div className="border border-danger border-5 fs-2 text-info text-center fw-bold m-1 ">
        <p className=" ">
          {raceDetails?.raceName} <br />
          {raceDetails?.season} #{raceDetails?.round} <br />
          {raceDetails?.date} {raceDetails?.time} <br />
          {raceDetails?.Circuit?.Location?.locality},{" "}
          {raceDetails?.Circuit?.Location?.country} (lat:
          {raceDetails?.Circuit?.Location?.lat} long:
          {raceDetails?.Circuit?.Location?.long})<br />
          {raceDetails?.Circuit?.circuitName} <br />
        </p>
      </div>

      <table className="table table-dark table-striped op table-bordered border-dark">
        <thead>
          <tr className="text-center">
            <th className="text-start">#</th>
            <th className="text-start">Driver Info</th>
            <th className="">
              Lap Time<i className="bi bi-sort-down-alt fs-4"></i>
            </th>
            <th>LAP</th>
            <th>POS</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((timing, index) => {
              const driver = drivers.find(
                (driver) => driver.driverId === timing.driverId
              );
              return (
                <tr key={index} className="">
                  <td className="p-0 text-end p-2">{index + 1}</td>
                  <td className="col-8 text-danger fw-bold ps-2 p-0 bg-black">
                    {driver
                      ? `${driver.givenName} ${driver.familyName} (${driver.permanentNumber}) ${driver.nationality} ${driver.dateOfBirth}`
                      : timing.driverId}
                  </td>
                  <td className="col-2 text-center p-0 bg-black">
                    {timing.time}
                  </td>
                  <td className="col-1 text-primary text-center bg-black p-0">
                    {timing.lapNumber}
                  </td>
                  <td className="col-1 text-success text-center bg-black p-0">
                    {timing.position}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Veri bulunamadı.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApiDataComponent;
