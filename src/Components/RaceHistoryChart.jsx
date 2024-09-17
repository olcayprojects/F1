import React, { useState, useEffect } from "react";
import LapTable from "./LapTable";
import { timeToSeconds } from "../utils/utils";
import Nav from "./Nav";
import Loading from "./Loading";

const RaceHistoryChart = () => {
  const [lapTimes, setLapTimes] = useState({});
  const [positions, setPositions] = useState({}); // New state for positions
  const [driverIds, setDriverIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState("");
  const [round, setRound] = useState("");
  const [info, setInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaceInfo = async () => {
      try {
        const response = await fetch(
          "https://ergast.com/api/f1/current/last/results.json"
        );
        const data = await response.json();

        if (season === "" && round === "") {
          setSeason(data.MRData.RaceTable.season);
          setRound(data.MRData.RaceTable.round);
          setInfo(data.MRData.RaceTable.Races[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Yarış bilgileri alınırken bir hata oluştu.");
      }
    };

    fetchRaceInfo();
  }, [season, round]);

  useEffect(() => {
    if (!season || !round) return;

    const fetchAllLapData = async () => {
      try {
        let allLapData = [];
        let offset = 0;
        const limit = 100;

        const fetchLapData = async (offset) => {
          const url = `https://ergast.com/api/f1/${season}/${round}/laps.json?limit=${limit}&offset=${offset}`;
          const response = await fetch(url);
          const data = await response.json();

          if (
            data.MRData &&
            data.MRData.RaceTable &&
            data.MRData.RaceTable.Races &&
            data.MRData.RaceTable.Races[0]
          ) {
            const lapsData = data.MRData.RaceTable.Races[0].Laps;
            const totalLaps = parseInt(data.MRData.total, 10);

            if (lapsData && lapsData.length > 0) {
              allLapData = allLapData.concat(lapsData);
              offset += limit; // Increment the offset

              if (allLapData.length >= totalLaps) {
                allLapData = allLapData.slice(0, totalLaps);
                return;
              }

              if (offset < totalLaps) {
                await fetchLapData(offset);
              }
            } else {
              return;
            }
          } else {
            console.error("Unexpected data structure:", data);
            setError("Unexpected data structure received.");
            return;
          }
        };

        await fetchLapData(offset);

        let allTimes = {};
        let allPositions = {}; // New object for positions

        allLapData.forEach((lap) => {
          lap.Timings.forEach((timing) => {
            if (!allTimes[timing.driverId]) {
              allTimes[timing.driverId] = {};
              allPositions[timing.driverId] = {}; // Initialize positions for this driver
            }
            allTimes[timing.driverId][lap.number] = timeToSeconds(timing.time);
            allPositions[timing.driverId][lap.number] = timing.position; // Add position
          });
        });

        const uniqueDriverIds = Object.keys(allTimes);

        let completeLapTimes = {};
        let completePositions = {}; // New object for positions
        allLapData.forEach((lap) => {
          completeLapTimes[lap.number] = {};
          completePositions[lap.number] = {}; // Initialize for each lap
          uniqueDriverIds.forEach((driverId) => {
            completeLapTimes[lap.number][driverId] =
              allTimes[driverId]?.[lap.number] ?? undefined;
            completePositions[lap.number][driverId] =
              allPositions[driverId]?.[lap.number] ?? undefined; // Add positions
          });
        });

        setDriverIds(uniqueDriverIds);
        setLapTimes(completeLapTimes);
        setPositions(completePositions); // Set positions
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lap times:", error);
        setError("Error fetching lap times.");
        setLoading(false);
      }
    };

    fetchAllLapData();
  }, [season, round]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Nav />
      <div className="RaceHistoryChart">
        <h1 className="text-info text-center">Race History Chart</h1>
        <h2 className="text-warning text-center">
          {new Date(info.date + "T" + info.time).toLocaleString()}_
          {info.raceName}_{info.Circuit?.circuitName}__{season} #{round}
        </h2>
        <LapTable lapTimes={lapTimes} driverIds={driverIds} positions={positions} />
      </div>
    </>
  );
};

export default RaceHistoryChart;
