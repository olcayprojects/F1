import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Constructor from "./Constructor";
import Nav from "./Nav";

import Loading from "./Loading";
import Team from "./Team";

const ConstructorsResult = () => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  let navigate = useNavigate();

  const { constructors = "red_bull" } = useParams();
  const [cons, setCons] = useState(constructors);

  const dateTime = (d, t) =>
    new Date().toLocaleString("en", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const { season = "2024" } = useParams();

  let url = `https://ergast.com/api/f1/${season}/constructors/${cons}/results.json?limit=100`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setIsLoaded(true);

          setData(items["MRData"].RaceTable?.Races);
        })
        .catch((err) => {
          console.log("Hata:", err.message);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div>
        <div className="container-fluid p-0">
          <Nav />

          <select
            className="form-select bg-black text-danger border-danger border-5 shadow-none cp mb-1"
            onChange={(e) => setCons(e.target.value)}
          >
            <option value="" hidden>
              {sdata[0]?.Results[0]?.Constructor?.name}
            </option>
            <Constructor year={season} />
          </select>
        </div>

        {sdata.map((items, index) => {
          return (
            <div className="text-danger" key={index}>
              <div className="table-responsive-sm">
                <table className="table table-striped table-dark caption-top table-bordered">
                  <caption className="text-primary bg-dark text-center fs-4">
                    <span className="bg-black p-2 fw-bold">
                      {items.raceName} <i className="bi bi-calendar3"></i>
                      {dateTime(items.date, items.time)}
                      <i className="bi bi-calendar3"></i>
                    </span>
                  </caption>
                  <thead>
                    <tr className="">
                      <th className="text-center">P</th>
                      <th className="bg-danger">DRIVER</th>
                      <th className=" text-center">TIME</th>
                      <th className="bg-danger text-center">STATUS</th>
                      <th className="text-center">PTS</th>
                      <th className="bg-danger">FASTEST LAP</th>
                      <th className="text-center">LAPS</th>
                      <th className="bg-danger text-center">GRID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.Results.map((item, index) => {
                      return (
                        <tr key={index} className="">
                          <td className="op text-center">
                            {item.positionText}
                          </td>
                          <td
                            className="cp"
                            onClick={() => {
                              navigate(
                                "/ResultsDriver/" + item.Driver.driverId
                              );
                            }}
                          >
                            {item.Driver.givenName +
                              " " +
                              item.Driver.familyName}
                          </td>
                          <td className="op text-center">{item.Time?.time}</td>
                          <td className="text-center">{item.status}</td>
                          <td className="text-center op">{item.points}</td>
                          <td>
                            {item?.FastestLap
                              ? item?.FastestLap?.rank +
                                ". Time: " +
                                item.FastestLap?.Time?.time +
                                " - AvgSpd: " +
                                item?.FastestLap?.AverageSpeed?.speed +
                                item?.FastestLap?.AverageSpeed?.units +
                                " - Lap: " +
                                item?.FastestLap?.lap
                              : null}
                          </td>
                          <td className="text-center op">{item.laps}</td>
                          <td className="text-center">{item.grid}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {season === "2024" ? (
          <Team teamName={sdata[0]?.Results[0]?.Constructor?.name} ls="5" />
        ) : (
          sdata[0]?.Results[0]?.Constructor?.name
        )}
      </div>
    );
  }
};

export default ConstructorsResult;
