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
          // console.log(err.message);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="container-fluid bg-black p-0">
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
          <table className="mytable table table-dark table-striped table-bordered">
            <thead className="text-center">
              <tr className="align-middle">
                <th className="bg-danger text-danger-emphasis">P</th>
                <th className="text-primary-emphasis bg-primary">G</th>
                <th className="text-start bg-info text-info-emphasis">
                  DRIVER
                </th>
                <th className="text-warning-emphasis text-start bg-warning">
                  CONSTRUCTOR
                </th>
                <th className="text-success-emphasis bg-success">LAPS</th>
                <th className="text-light-emphasis bg-light">TIME</th>
                <th
                  className="text-light-emphasis bg-secondary text-center
                "
                >
                  STATUS
                </th>
                <th className="text-danger-emphasis bg-danger">PTS</th>
                <th className="text-light-emphasis bg-light op text-start">
                  FASTEST LAP
                </th>
              </tr>
            </thead>
            <tbody className="">
              {data?.SprintResults.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={
                      "align-middle " + (index === 0 ? "fs-6 fw-bolder" : null)
                    }
                  >
                    <td className="text-center text-danger">
                      <span className="bg-black d-block">
                        {item.positionText}
                      </span>
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
                      <span className="bg-black px-1 bg-gradient">
                        {item.Driver.givenName}{" "}
                        {item.Driver.familyName.toUpperCase()}
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
                      <span className="bg-black px-1 bg-gradient">
                        {item.Constructor.name}
                      </span>
                      <span className="fst-italic fw-normal bg-warning text-black px-2">
                        {item.Constructor.nationality}
                      </span>
                    </td>
                    <td className="text-center text-success">{item.laps}</td>
                    <td className="op text-center py-0">
                      <span className="">{item.Time?.time}</span>
                    </td>
                    <td className="op text-center py-0">
                      <span className="text-secondary">{item.status}</span>
                    </td>
                    <td className="text-center fw-bold py-0">
                      <span
                        className={
                          item.points > 0
                            ? "bg-black px-1 text-danger rounded"
                            : "text-secondary"
                        }
                      >
                        {item.points}
                      </span>
                    </td>
                    <td className="op py-0 text-start">
                      <span className="">
                        {item.FastestLap && (
                          <span className="">
                            {item.FastestLap.rank
                              ? `${item.FastestLap.rank} - ${item.FastestLap.Time.time} (Lap: ${item.FastestLap.lap})`
                              : `${item.FastestLap.Time.time} (Lap: ${item.FastestLap.lap})`}
                          </span>
                        )}
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
