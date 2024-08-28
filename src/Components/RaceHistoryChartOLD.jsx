import React from "react";
import { useEffect, useState } from "react";
import DriverId from "./DriverId";
import Nav from "./Nav";
import Loading from "./Loading";

export const RaceHistoryChart = () => {
  const [sdata, setData] = useState([]);
  const [season, setSeason] = useState("");
  const [round, setRound] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const dateTime = (d, t) =>
    new Date(d + " " + t).toLocaleString("en-EN", {
      dateStyle: "full",
      timeStyle: "short",
    });

  let d = new Date();
  const year = new Date().getFullYear();
  const years = Array.from(new Array(75), (val, index) => year - index);

  let urlx = "";

  fetch("https://ergast.com/api/f1/current/last/results.json")
    .then((response) => response.json())
    .then((data) => {
      if ((season === "") & (round === "")) {
        setSeason(data.MRData.RaceTable.season);
        setRound(data.MRData.RaceTable.round);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  urlx = `https://ergast.com/api/f1/${season}/${round}/laps.json?limit=1200`;
  const fetchData = async (url) => {
    setIsLoaded(false);

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"]?.RaceTable?.Races[0]);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setIsLoaded(true);
      });
  };

  useEffect(() => {
    if (round !== "") {
      fetchData(urlx);
    }
  }, [urlx, season, round]);

  return (
    <>
      <Nav />
      <div className="container mt-1">
        <select
          className="bg-black text-danger mx-1 fs-5 text-center shadow-none cp mb-1"
          onChange={(e) => {
            setSeason(e.target.value);
          }}
        >
          <option value="" hidden>
            Select Year 1950 - {d.getFullYear()}
          </option>
          {years.map((year, index) => {
            return (
              <option key={`year${index}`} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <select
          className="bg-black text-danger fs-5 text-center shadow-none cp mb-1"
          onChange={(e) => {
            setRound(e.target.value);
          }}
        >
          <option value="" hidden>
            Select Round
          </option>
          {Array.from(new Array(24), (val, index) => 24 - index)
            .reverse()
            .map((rnd, index) => {
              return (
                <option key={`rnd${index}`} value={rnd}>
                  {rnd}
                </option>
              );
            })}
        </select>
      </div>

      {sdata ? (
        <>
          <div>
            <h2 className="text-center text-secondary fw-bold">
              {sdata.raceName} {sdata.season}#{sdata.round} -{" "}
              {sdata.Circuit?.Location.locality} / {sdata.Circuit?.circuitName}
            </h2>
            <h6 className="text-center fw-bold text-secondary">
              {dateTime(sdata.date, sdata.time)}
            </h6>
          </div>
          <div className="container-fluid p-0">
            <div className="row row-cols-1 row-cols-md-auto g-1 justify-content-sm-center">
              {sdata.Laps?.map((LapTimes, index) => {
                if (!isLoaded) {
                  return <Loading />;
                }
                return (
                  <div className="container py-0" key={index}>
                    <table className="table table-bordered table-striped m-0 mb-1">
                      <caption className="text-center bg-dark mx-4 border-start border-end border-top border-danger border-3 p-0 text-secondary caption-top">
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
                              TIME{" "}
                              <i className="bi bi-arrow-down-circle-fill"></i>
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
      ) : (
        <h1 className="text-center text-danger">Data Not Found!</h1>
      )}
    </>
  );
};

export default RaceHistoryChart;
