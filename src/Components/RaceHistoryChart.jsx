// RaceHistoryChart.jsx
import React, { useState, useEffect } from "react";
import LapTable from "./LapTable";
import { timeToSeconds } from "../utils/utils";
import Nav from "./Nav";

const RaceHistoryChart = () => {
  const [lapTimes, setLapTimes] = useState({});
  const [driverIds, setDriverIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState("");
  const [round, setRound] = useState("");
  const [info, setInfo] = useState("");

  let urlx = "";

  urlx = `https://ergast.com/api/f1/${season}/${round}/laps.json?limit=1200`;

  fetch("https://ergast.com/api/f1/current/last/results.json")
    .then((response) => response.json())
    .then((data) => {
      if ((season === "") & (round === "")) {
        setSeason(data.MRData.RaceTable.season);
        setRound(data.MRData.RaceTable.round);
        setInfo(data.MRData.RaceTable.Races[0]);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlx);
        const data = await response.json();

        const lapsData = data.MRData.RaceTable.Races[0].Laps;

        let allTimes = {};
        lapsData.forEach((lap) => {
          lap.Timings.forEach((timing) => {
            if (!allTimes[timing.driverId]) {
              allTimes[timing.driverId] = {};
            }
            allTimes[timing.driverId][lap.number] = timeToSeconds(timing.time);
          });
        });

        const uniqueDriverIds = Object.keys(allTimes);

        let completeLapTimes = {};
        lapsData.forEach((lap) => {
          completeLapTimes[lap.number] = {};
          uniqueDriverIds.forEach((driverId) => {
            if (
              allTimes[driverId] &&
              allTimes[driverId][lap.number] !== undefined
            ) {
              completeLapTimes[lap.number][driverId] =
                allTimes[driverId][lap.number];
            } else {
              completeLapTimes[lap.number][driverId] = undefined;
            }
          });
        });

        setDriverIds(uniqueDriverIds);
        setLapTimes(completeLapTimes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [urlx]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Nav />
      <div className="RaceHistoryChart">
        <h1 className="text-info text-center">Race History Chart </h1>
        <h2 className="text-warning text-center">
          {new Date(info.date+"T"+info.time).toLocaleString()}_
          {info.raceName}_
          {info.Circuit?.circuitName}__{season} #{round}
        </h2>
        <LapTable lapTimes={lapTimes} driverIds={driverIds} />
      </div>
    </>
  );
};

export default RaceHistoryChart;
