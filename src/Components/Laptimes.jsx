import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDrivers } from "../context/DriverContext";
import Loading from "./Loading";
import RaceSimulation from "./RaceSimulation";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Laptimes = (props) => {
  const [laps, setLaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { season2 = "2025" } = useParams();
  const { drivers, setSeason } = useDrivers();
  const [pitStops, setPitStops] = useState([]);

  const season = props.season || season2;
  const round = props.round || "18";

  useEffect(() => {
    setSeason(season);
  }, [season, setSeason]);

  useEffect(() => {
    const fetchPitStops = async () => {
      try {
        const url = `${BASE_URL}/${season}/${round}/pitstops.json?limit=100`;
        const res = await fetch(url);
        const data = await res.json();
        const pitStopsData = data?.MRData?.RaceTable?.Races[0]?.PitStops || [];
        setPitStops(pitStopsData);
      } catch (error) {
        console.error("Pit stop verisi alınamadı:", error);
      }
    };

    fetchPitStops();
  }, [season, round]);

  useEffect(() => {
    const fetchLaps = async () => {
      try {
        let allLaps = [];
        let offset = 0;
        const limit = 100;
        let total = null;

        do {
          const url = `${BASE_URL}/${season}/${round}/laps.json?limit=${limit}&offset=${offset}`;
          const res = await fetch(url);
          const data = await res.json();
          const newLaps = data?.MRData?.RaceTable?.Races[0]?.Laps || [];
          total = parseInt(data?.MRData?.total || "0", 10);

          allLaps = [...allLaps, ...newLaps];
          offset += limit;
        } while (offset < total);

        const mergedLaps = {};
        allLaps.forEach((lap) => {
          const lapNum = lap.number;
          if (!mergedLaps[lapNum]) {
            mergedLaps[lapNum] = { ...lap };
          } else {
            mergedLaps[lapNum].Timings = [
              ...mergedLaps[lapNum].Timings,
              ...lap.Timings,
            ];
          }
        });

        const finalLaps = Object.values(mergedLaps)
          .map((lap) => ({
            ...lap,
            Timings: lap.Timings.sort((a, b) => a.time.localeCompare(b.time)),
          }))
          .sort((a, b) => Number(a.number) - Number(b.number));

        setLaps(finalLaps);

        setLoading(false);
      } catch (error) {
        console.error("Laps verisi alınamadı:", error);
      }
    };

    fetchLaps();
  }, [season, round]);

  if (loading) return <Loading />;

  return (
    <div className="container-fluid">
      <div className="">
        <RaceSimulation laps={laps} drivers={drivers} pitStops={pitStops} />

        {/* <div className="row">
        {laps.map((lap, index) => (
          <div key={index} className="col-6 col-sm-4 col-md-2 col-lg-1 mb-1">
            <table className="table table-dark table-striped table-bordered table-sm m-0">
              <caption className="text-center p-0 bg-dark text-danger border-1 border border-danger caption-top">
                <strong>
                  LAP <span className="text-warning">{lap.number}</span>
                </strong>
              </caption>
              <thead>
                <tr>
                  <th className="p-0 text-center">Drv</th>
                  <th className="p-0 text-center">P</th>
                  <th className="text-center p-0">Time</th>
                </tr>
              </thead>
              <tbody>
                {lap.Timings.map((timing, i) => {
                  const driver = drivers.find(
                    (d) => d.driverId === timing.driverId
                  );
                  // const name = driver
                  //   ? `${driver.givenName[0]}. ${driver.familyName}`
                  const code = driver ? driver.code : timing.driverId;

                  return (
                    <tr key={i}>
                      <td
                        className={
                          "p-0 text-center " +
                          (timing.position === "1" ? "text-danger fw-bold" : "")
                        }
                      >
                        {code}
                      </td>
                      <td className="text-warning text-center p-0">
                        {timing.position}
                      </td>
                      <td className="p-0 text-center">{timing.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div> */}
      </div>
    </div>
  );
};

export default Laptimes;
