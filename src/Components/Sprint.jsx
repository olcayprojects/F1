import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Nav from "./Nav";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Sprint = () => {
  const { season2 = "2024" } = useParams();
  const { rounds = "1" } = useParams();
  const { sprintDate = null } = useParams();
  // const dateTime = (d, t) => new Date(d + " " + t);

  const [data, setData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  let navigate = useNavigate();

  let url = `${BASE_URL}/${season2}/${rounds}/sprint.json`;

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

        <h3 className="text-black text-center fw-bold mt-2 m-0">
          <span className="bg-info px-1">
            {data?.raceName}|{data?.Circuit?.circuitName} Sprint Results
          </span>
        </h3>
        <h5 className="text-center fw-bold mt-1">
          <span className="bg-info text-black px-1">
            {data?.season}#{data?.round} - {sprintDate}
          </span>
        </h5>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped table-bordered">
            <thead className="text-center">
              <tr className="align-middle">
                <th className="">P</th>
                <th className="bg-primary">G</th>
                <th className="text-start bg-info text-black">DRIVER</th>
                <th className="text-start bg-warning">CONSTRUCTOR</th>
                <th className="p-0 bg-success">LAPS</th>
                <th className="bg-light text-end">TIME</th>
                <th className="p-0">PTS</th>
                <th className="bg-light text-start">FASTEST LAP</th>
              </tr>
            </thead>
            <tbody className="">
              {data?.SprintResults.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={
                      "align-middle " + (index === 0 ? "fs-5 fw-bolder" : null)
                    }
                  >
                    <td className="p-0 text-center text-danger">
                      {item.positionText}
                    </td>
                    <td className="op text-center fw-normal text-primary p-0">
                      {item.grid}
                    </td>
                    <td
                      className="text-info cp py-0"
                      onClick={() => {
                        navigate("/ResultsDriver/" + item.Driver.driverId);
                      }}
                    >
                      <span className="bg-black px-2 text-uppercase">
                        {item.Driver.givenName} {item.Driver.familyName}
                      </span>
                      <span className="fst-italic fw-normal bg-info text-black px-2">
                        {item.Driver.nationality}
                      </span>
                    </td>
                    <td
                      className="op fst-italic text-warning cp py-0"
                      onClick={() => {
                        navigate(
                          "/ConstructorsResult/" +
                            item?.Constructor?.constructorId +
                            "/" +
                            season2
                        );
                      }}
                    >
                      <span className="bg-black px-2">
                        {item.Constructor.name.toUpperCase()}
                      </span>
                      <span className="fst-italic fw-normal bg-warning text-black px-2">
                        {item.Constructor.nationality}
                      </span>
                    </td>
                    <td className="text-center p-0 text-success">
                      {item.laps}
                    </td>
                    <td className="op text-end py-0">
                      <span className="">
                        {item.Time?.time ? item.Time?.time : item.status}
                      </span>
                    </td>
                    <td className="text-center text-danger fw-bolder p-0 py-0">
                      {item.points}
                    </td>
                    <td className="op py-0 text-start">
                      <span className="">
                        {item.FastestLap
                          ? "#" +
                            item.FastestLap?.rank +
                            " | " +
                            item.FastestLap?.Time.time +
                            " | Lap: " +
                            item.FastestLap?.lap
                          : null}
                      </span>
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
