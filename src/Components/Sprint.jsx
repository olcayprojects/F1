import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Nav from "./Nav";

const Sprint = () => {
  const { season2 = "2023" } = useParams();
  const { rounds = "1" } = useParams();
  const { sprintDate = null } = useParams();
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
        <Nav />

        <h2 className="bg-info text-black text-center fw-bold mt-1">
          {data?.raceName}|{data?.Circuit?.circuitName} Sprint Results -{" "}
          {data?.season}#{data?.round} - {sprintDate}
        </h2>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped table-bordered">
            <thead className="fw-bold">
              <tr className="fs-5">
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
                  <tr key={index} className="align-middle">
                    <td className="col">{item.positionText}</td>
                    <td className="col op">{item.grid}</td>
                    <td className="col fs-5 text-info">
                      <span className="bg-black p-1">
                        {item.Driver.givenName} {item.Driver.familyName}
                      </span>
                      <span className="fst-italic fw-normal ">
                        {" "}
                        {item.Driver.nationality}
                      </span>
                    </td>
                    <td className="col op fs-5 fst-italic text-warning">
                      <span className="bg-black p-1">
                        {item.Constructor.name}
                      </span>
                      <span className="fst-italic fw-normal ">
                        {" "}
                        {item.Constructor.nationality}
                      </span>
                    </td>
                    <td className="col text-center">{item.laps}</td>
                    <td className="col op">
                      {item.Time?.time ? item.Time?.time : item.status}
                    </td>
                    <td className="col text-center text-danger fw-bolder">
                      {item.points}
                    </td>
                    <td className="col op">
                      {item.FastestLap
                        ? item.FastestLap?.Time.time +
                          " | Lap: " +
                          item.FastestLap?.lap
                        : ""}
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
