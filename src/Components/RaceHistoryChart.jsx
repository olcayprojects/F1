import React from "react";
import { useEffect, useState } from "react";
import DriverId from "./DriverId";
import Nav from "./Nav";

export const RaceHistoryChart = () => {
  const [sdata, setData] = useState([]);
  const [season, setSeason] = useState("2024");
  const [round, setRound] = useState("1");

  const dateTime = (d, t) =>
    new Date(d + " " + t).toLocaleString("en-EN", {
      dateStyle: "full",
      timeStyle: "short",
    });

  let urlx = "";

  fetch("https://ergast.com/api/f1/current/last/results.json")
    .then((response) => response.json())
    .then((data) => {
      setSeason(data.MRData.RaceTable.season);
      setRound(data.MRData.RaceTable.round);
    })
    .catch((err) => {
      console.log(err);
    });

  urlx = `https://ergast.com/api/f1/${season}/${round}/laps.json?limit=1200`;
  const fetchData = async (url) => {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"]?.RaceTable?.Races[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData(urlx);
  }, [urlx]);

  return sdata ? (
    <>
      <Nav />
      <h2 className="text-center text-secondary fw-bold">
        {sdata.raceName} {sdata.season}#{sdata.round} -{" "}
        {sdata.Circuit?.Location.locality} / {sdata.Circuit?.circuitName}
      </h2>
      <h6 className="text-center fw-bold text-secondary">
        {dateTime(sdata.date, sdata.time)}
      </h6>
      <div className="container-fluid p-0">
        <div className="row row-cols-1 row-cols-md-auto g-1 justify-content-sm-center">
          {sdata.Laps?.map((LapTimes, index) => {
            return (
              <div key={index}>
                <table className="table table-bordered table-striped m-0 mb-3">
                  <caption className="text-center bg-dark p-0 text-secondary caption-top">
                    <span className="fw-bold px-2 p-1 text-info">
                      LAP <span className="">{LapTimes.number}</span>
                    </span>
                  </caption>
                  <thead className="">
                    <tr className="">
                      <th className="py-0">
                        <span className="p-0">DRIVER</span>
                      </th>
                      <th className="text-center py-0">
                        <span className="px-1">P</span>
                      </th>
                      <th className="text-center p-0 py-0">
                        <span className="">
                          TIME <i className="bi bi-arrow-down-circle-fill"></i>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {LapTimes.Timings.sort((a, b) =>
                      a["time"] > b["time"] ? 1 : -1
                    ).map((lap, index) => {
                      return (
                        <tr key={index} className="">
                          <td
                            key={index}
                            className={lap.position < 4 ? "py-0" : "py-0"}
                          >
                            <span className="d-block text-center">
                              {<DriverId Id={lap.driverId} ls={0} />}
                            </span>

                            {/* {LapTimes.driverId} */}
                          </td>
                          <td className="text-center bg-light py-0">
                            {lap.position > 3 ? (
                              lap.position
                            ) : (
                              <i
                                className={
                                  "fs-5 bi bi-" +
                                  lap.position[0] +
                                  "-square-fill"
                                }
                              ></i>
                            )}
                          </td>
                          <td className="text-center py-0">{lap.time}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </>
  ) : null;
};

export default RaceHistoryChart;
