import React, { useEffect, useState, useCallback } from "react";
import DriverId from "./DriverId";
import { useParams } from "react-router-dom";
import Loading from "./Loading";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Laptimes = (props) => {
  const [sdata, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [displayedLaps, setDisplayedLaps] = useState([]);
  const [animatingLaps, setAnimatingLaps] = useState([]);
  const { season2 = "2025" } = useParams();

  let urlx = "";
  if (props.season) {
    urlx = `${BASE_URL}/${props.season}/${props.round}/laps.json`;
  } else {
    urlx = `${BASE_URL}/${season2}/18/laps.json?limit=30&offset=0`;
  }

  const fetchData = useCallback(async (url, offset = 0, total, limit = 30) => {
    try {
      const response = await fetch(`${url}?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error("Veri çekme başarısız oldu.");
      }

      const data = await response.json();
      const lapsData = data?.MRData?.RaceTable?.Races[0]?.Laps;

      if (lapsData && lapsData.length > 0) {
        setData((prevData) => {
          const newData = [...prevData, ...lapsData];
          const uniqueData = [];

          newData.forEach((lap) => {
            const existingLap = uniqueData.find(
              (item) => item.number === lap.number
            );
            if (existingLap) {
              existingLap.Timings = [...existingLap.Timings, ...lap.Timings];
            } else {
              uniqueData.push({ ...lap });
            }
          });

          const sortedData = uniqueData.map((lap) => {
            const sortedTimings = lap.Timings.sort((a, b) =>
              a["time"] > b["time"] ? 1 : -1
            );
            return { ...lap, Timings: sortedTimings };
          });

          return sortedData;
        });

        if (offset + limit < total) {
          fetchData(url, offset + limit, total, limit);
        }
      } else {
        console.log("Laps verisi bulunamadı.");
      }
    } catch (err) {
      console.error("Hata:", err);
    }
  }, []);

  const fetchTotalData = useCallback(
    async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Veri çekme başarısız oldu.");
        }

        const data = await response.json();
        const total = data?.MRData?.total;
        const limit = 30;
        if (total) {
          await fetchData(url, 0, total, limit);
        }
      } catch (err) {
        console.error("Hata:", err);
      }
    },
    [fetchData]
  );

  useEffect(() => {
    fetchTotalData(urlx);
  }, [fetchTotalData, urlx]);

  useEffect(() => {
    if (sdata.length > 0) {
      setLoading(false);

      const timer = setInterval(() => {
        setDisplayedLaps((prev) => {
          if (prev.length >= sdata.length) {
            clearInterval(timer);
            return prev;
          }
          return [...prev, sdata[prev.length]];
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [sdata]);

  useEffect(() => {
    if (displayedLaps.length > 0) {
      const newAnimStates = displayedLaps.map((_, index) => {
        if (displayedLaps.length - index <= 7) {
          return "table-fade-in";
        } else {
          return "table-fade-out";
        }
      });

      setAnimatingLaps(newAnimStates);
    }
  }, [displayedLaps]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-fluid pt-2 p-0">
      <DriverId setDrivers={setDrivers} season={props.season} />
      <div className="table-container clearfix">
        {displayedLaps
          .sort((a, b) => a.number - b.number)
          .map((data, index) => {
            if (displayedLaps.length - index <= 7) {
              return (
                <div key={index} className="col-lg col-md-4 col-sm-6 mb-3 me-1">
                  <table
                    className={`table-fade table table-dark table-striped table-bordered border-3 table-sm m-0 ${animatingLaps[index]}`}
                  >
                    <caption className="text-center p-0 bg-dark text-danger border-top border-start border-end border-3 border-danger mx-5 caption-top">
                      <span className="fw-bold">
                        LAP <span className="text-warning">{data.number}</span>
                      </span>
                    </caption>
                    <thead>
                      <tr>
                        <th>Driver</th>
                        <th>P</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.Timings.map((timings, index) => {
                        const driver = drivers.find(
                          (driver) => driver.driverId === timings.driverId
                        );
                        const coLor =
                          timings?.position === "1"
                            ? "text-danger fw-bold"
                            : "";
                        const fontSize =
                          driver &&
                          driver.givenName.length + driver.familyName.length >
                            20
                            ? "12px"
                            : "";
                        const driverFullName = `${driver?.givenName?.substring(
                          0,
                          1
                        )}. ${driver.familyName}`;

                        return (
                          <tr key={index} className="border-bottom border-4 ">
                            <td className={`p-0 ${coLor}`} style={{ fontSize }}>
                              {driver ? driverFullName : timings.driverId}
                            </td>
                            <td className="p-0 px-1 text-warning text-center">
                              {timings.position}
                            </td>
                            <td className="p-0 px-1">{timings.time}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
};

export default Laptimes;
