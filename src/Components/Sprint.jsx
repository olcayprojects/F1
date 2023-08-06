import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const Sprint = () => {
  const { season2 = "2023" } = useParams();
  const { rounds = "1" } = useParams();
  const dateTime = (d, t) => new Date(d + " " + t);

  const [data, setData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  let url = `https://ergast.com/api/f1/${season2}/${rounds}/sprint.json`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setIsLoaded(true);

          setData(items["MRData"].RaceTable.Races[0]);
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="container-fluid p-0">
        <Link to="/" className="btn btn-danger container-fluid mb-1">
          <h1 className="text-black fw-bold">F1 Race Results</h1>
        </Link>
        <h2 className="bg-info text-black text-center">
          {data?.raceName.toUpperCase()}/
          {data?.Circuit?.circuitName.toUpperCase()} Sprint Results -{" "}
          {data?.season}#{data?.round} -{" "}
          {dateTime(data?.date, data?.time).toLocaleString()}
        </h2>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped">
            <thead className="text fw-bold">
              <tr className="">
                <th className="">P</th>
                <th className="bg-danger">G</th>
                <th className="">DRIVER</th>
                <th className="bg-danger">CONSTRUCTOR</th>
                <th className="text-center">LAPS</th>
                <th className="bg-danger">TIME</th>
                <th className="text-center">PTS</th>
                <th className="bg-danger">FASTEST LAP</th>
              </tr>
            </thead>
            <tbody className="fw-bold">
              {data?.SprintResults.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="col">{item.positionText}</td>
                    <td className="col">{item.grid}</td>
                    <td className="col-2">
                      {item.Driver.givenName} {item.Driver.familyName}
                    </td>
                    <td className="col-2">{item.Constructor.name}</td>
                    <td className="col-1 text-center">{item.laps}</td>
                    <td className="col-2">
                      {item.Time?.time ? item.Time?.time : item.status}
                    </td>
                    <td className="col-1 text-center">{item.points}</td>
                    <td className="col-4">
                      {item.FastestLap
                        ? "Time: " +
                          item.FastestLap?.Time.time +
                          " Lap: " +
                          item.FastestLap?.lap
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default Sprint;
