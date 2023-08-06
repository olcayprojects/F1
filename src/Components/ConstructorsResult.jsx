import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Constructor from "./Constructor";

import Loading from "./Loading";
import Team from "./Team";

const ConstructorsResult = () => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { constructors = "red_bull" } = useParams();
  const [cons, setCons] = useState(constructors);

  const { season = "2020" } = useParams();

  let url = `https://ergast.com/api/f1/${season}/constructors/${cons}/results.json`;

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
          <Link
            to="/"
            className="btn btn-danger text-black container-fluid mb-1"
          >
            <h1>
              <b>F1 Race Results</b>
            </h1>
          </Link>
          <select
            className="form-select bg-black text-danger border-danger border-5 shadow-none cp mb-1"
            onChange={(e) => setCons(e.target.value)}
          >
            <option value="" hidden>
              Select Constructors
            </option>
            <Constructor year={season} />
          </select>
        </div>
        <h2 className="text-light text-center m-0">
          {season === "2023" ? (
            <Team teamName={sdata[0]?.Results[0]?.Constructor?.name} />
          ) : (
            sdata[0]?.Results[0]?.Constructor?.name
          )}
        </h2>
        {sdata.map((items, index) => {
          return (
            <div className="text-danger" key={index}>
              <div className="table-responsive-sm">
                <table className="table table-striped table-dark caption-top">
                  <caption className="text-danger bg-dark text-center fs-4">
                    <b>{items.raceName + " " + items.date}</b>
                  </caption>
                  <thead>
                    <tr className="">
                      <th className="bg-danger">P</th>
                      <th className="bg-danger">DRIVER</th>
                      <th>TIME</th>
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
                          <td>{item.positionText}</td>
                          <td>
                            {item.Driver.givenName +
                              " " +
                              item.Driver.familyName}
                          </td>
                          <td>{item.Time?.time}</td>
                          <td className="text-center">{item.status}</td>
                          <td className="text-center">{item.points}</td>
                          <td>
                            {item?.FastestLap
                              ? "#" +
                                item?.FastestLap?.rank +
                                "# Time: " +
                                item.FastestLap?.Time?.time +
                                " - AvgSpd: " +
                                item?.FastestLap?.AverageSpeed?.speed +
                                item?.FastestLap?.AverageSpeed?.units +
                                " - Lap: " +
                                item?.FastestLap?.lap
                              : ""}
                          </td>
                          <td className="text-center">{item.laps}</td>
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
      </div>
    );
  }
};

export default ConstructorsResult;
