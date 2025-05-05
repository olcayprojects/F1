import React, { useState, useEffect } from "react";
import LapTable from "./LapTable";
import { timeToSeconds } from "../utils/utils";
import Nav from "./Nav";
import Loading from "./Loading";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RaceHistoryChart = () => {
  const [lapTimes, setLapTimes] = useState({});
  const [positions, setPositions] = useState({});
  const [driverIds, setDriverIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState("");
  const [round, setRound] = useState("");
  const [info, setInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaceInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/current/last/results.json`);
        const data = await response.json();

        if (season === "" && round === "") {
          setSeason(data.MRData.RaceTable.season);
          setRound(data.MRData.RaceTable.round);
          setInfo(data.MRData.RaceTable.Races[0]);
        }
      } catch (err) {
        // console.error(err);
        setError("Data not found!");
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
          const url = `${BASE_URL}/${season}/${round}/laps.json?limit=${limit}&offset=${offset}`;
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
              offset += limit;

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
            // console.error("Unexpected data structure:", data);
            setError("Data Not Found!");
            return;
          }
        };

        await fetchLapData(offset);

        let allTimes = {};
        let allPositions = {};

        allLapData.forEach((lap) => {
          lap.Timings.forEach((timing) => {
            if (!allTimes[timing.driverId]) {
              allTimes[timing.driverId] = {};
              allPositions[timing.driverId] = {};
            }
            allTimes[timing.driverId][lap.number] = timeToSeconds(timing.time);
            allPositions[timing.driverId][lap.number] = timing.position;
          });
        });

        const uniqueDriverIds = Object.keys(allTimes);

        // let completeLapTimes = {};
        // let completePositions = {};
        // allLapData.forEach((lap) => {
        //   completeLapTimes[lap.number] = {};
        //   completePositions[lap.number] = {};
        //   uniqueDriverIds.forEach((driverId) => {
        //     completeLapTimes[lap.number][driverId] =
        //       allTimes[driverId]?.[lap.number] ?? undefined;
        //     completePositions[lap.number][driverId] =
        //       allPositions[driverId]?.[lap.number] ?? undefined;
        //   });
        // });

        let completeLapTimes = {};
        let completePositions = {};
        allLapData.forEach((lap) => {
          completeLapTimes[lap.number] = {};
          completePositions[lap.number] = {};
          uniqueDriverIds.forEach((driverId) => {
            if (
              allTimes[driverId]?.[lap.number] !== undefined &&
              allPositions[driverId]?.[lap.number] !== undefined
            ) {
              completeLapTimes[lap.number][driverId] =
                allTimes[driverId][lap.number];
              completePositions[lap.number][driverId] =
                allPositions[driverId][lap.number];
            }
          });
        });

        setDriverIds(uniqueDriverIds);
        setLapTimes(completeLapTimes);
        setPositions(completePositions);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchAllLapData();
  }, [season, round]);

  if (loading) return <Loading />;
  if (error)
    return (
      <>
        <Nav />
        <div className="text-center text-danger mt-5">
          <h3>
            {season}#{round}
          </h3>
          <h4>{error}</h4>
        </div>
        ;
      </>
    );

  return (
    <>
      <Nav />
      <div className="RaceHistoryChart">
        <h2 className="text-info text-center">
          Last Race Laps, Times, and Positions
        </h2>
        <h4 className="text-warning text-center">
          <span className="text-danger">
            {new Date(info.date + "T" + info.time).toLocaleString()}
          </span>
          <span className="text-primary px-1">{info.raceName}</span>
          {/* <span className="text-success">{info.Circuit?.circuitName}</span> */}
          <span className="text-warning px-1">
            {season} #{round}
          </span>
        </h4>
        <LapTable
          lapTimes={lapTimes}
          driverIds={driverIds}
          positions={positions}
        />
      </div>
    </>
  );
};

export default RaceHistoryChart;
