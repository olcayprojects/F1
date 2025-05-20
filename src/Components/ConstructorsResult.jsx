import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Constructor from "./Constructor";
import Nav from "./Nav";

import Loading from "./Loading";
import Team from "./Team";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ConstructorsResult = () => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  let navigate = useNavigate();

  const { constructors = "ferrari" } = useParams();
  const { season = "2024" } = useParams();
  const [cons, setCons] = useState(constructors);
  const [seas, setSeas] = useState(season);

  const year = new Date().getFullYear();
  const years = Array.from(new Array(75), (val, index) => year - index);

  const dateTime = (d, t) =>
    new Date(d + " " + t).toDateString() +
    " " +
    new Date(d + " " + t).toLocaleTimeString();

  let url = `${BASE_URL}/${seas}/constructors/${cons}/results.json?limit=100`;

  useEffect(() => {
    function fetchData() {
      setIsLoaded(false);
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

  return (
    <div>
      <div className="container-fluid p-0">
        <Nav />
        <div className="text-center">
          <select
            className="bg-black bg-gradient text-center me-1 fs-5 text-danger mb-1"
            onChange={(e) => {
              setSeas(e.target.value);
            }}
          >
            <option value="" hidden className="">
              {seas}
            </option>
            {years.map((year, index) => {
              return (
                <option key={`year${index}`} value={year} className="">
                  {year}
                </option>
              );
            })}
          </select>
          <select
            className="bg-black bg-gradient text-center fs-5 text-danger mb-1"
            onChange={(e) => setCons(e.target.value)}
          >
            <option value="" hidden>
              {sdata[0]?.Results[0]?.Constructor?.name}
            </option>
            <Constructor year={seas} />
          </select>
        </div>
      </div>

      {sdata.length
        ? sdata.map((items, index) => {
            return (
              <div className="text-danger container-fluid" key={index}>
                <div className="table-responsive-sm">
                  <table className="table table-striped table-dark caption-top table-bordered">
                    <caption className="text-primary bg-dark text-center fs-5">
                      <span className="bg-black p-2 fw-bold">
                        {items.raceName}/{items.Circuit?.Location?.locality}
                        {" Round#"}
                        {items.round}
                        <i className="bi bi-calendar3 ms-1">
                          <span className="px-2 text-info">
                            {items.time
                              ? dateTime(items.date, items.time)
                              : new Date(items.date).toDateString()}
                          </span>
                        </i>
                        <i className="bi bi-calendar3"></i>
                      </span>
                    </caption>
                    <thead>
                      <tr className="">
                        <th className="text-center bg-info text-info-emphasis text-info">
                          P
                        </th>
                        <th className="text-center bg-dark text-black op">G</th>
                        <th className="bg-light-subtle text-light-emphasis">
                          DRIVER
                        </th>
                        <th className="text-center bg-secondary text-secondary-emphasis op">
                          TIME
                        </th>
                        <th className="text-center bg-success text-success-emphasis">
                          STATUS
                        </th>
                        <th className="text-warning text-center bg-warning text-warning-emphasis op">
                          PTS
                        </th>
                        <th className="text-center bg-primary text-primary-emphasis">
                          LAPS
                        </th>
                        <th className="text-center bg-danger text-danger-emphasis op">
                          FASTEST LAP
                        </th>
                      </tr>
                    </thead>
                    <tbody className="fw-bold">
                      {!isLoaded ? (
                        <Loading />
                      ) : (
                        items?.Results.map((item, index) => {
                          return (
                            <tr key={index} className="">
                              <td className="op text-center text-info fw-bold">
                                {/* {!isNaN(+item.positionText)
                                  ? item.positionText
                                  : item.position +
                                    " (" +
                                    item.positionText +
                                    ")"} */}
                                {item.position}
                              </td>
                              <td className="text-center text-black">
                                {item.grid}
                              </td>
                              <td
                                className="cp op fw-bold"
                                onClick={() => {
                                  navigate(
                                    "/ResultsDriver/" + item.Driver.driverId
                                  );
                                }}
                              >
                                {item.Driver.givenName +
                                  " " +
                                  item.Driver.familyName}
                                <span className="px-1 fst-italic fw-normal text-white-50">
                                  (
                                  {new Date(
                                    item.Driver.dateOfBirth
                                  ).toDateString()}
                                  )
                                </span>
                                <span className=" fw-normal text-white-50">
                                  {item.Driver.nationality}
                                </span>
                              </td>
                              <td className="text-center text-secondary">
                                {item.Time?.time ? item.Time?.time : "-"}
                              </td>
                              <td className="op text-center">
                                <span className="text-success px-2">
                                  {item.status}
                                </span>
                              </td>
                              <td className="text-center text-warning p-0">
                                {item.points}
                              </td>
                              <td className="text-center text-primary op p-0">
                                {item.laps}
                              </td>

                              {item?.FastestLap ? (
                                <td className="p-0 text-center text-danger">
                                  {item?.FastestLap?.rank} => [ Time:{" "}
                                  {item.FastestLap?.Time?.time}
                                  {item?.FastestLap?.AverageSpeed?.speed &&
                                    item?.FastestLap?.AverageSpeed?.units &&
                                    " - AvgSpd: " +
                                      item.FastestLap?.AverageSpeed?.speed +
                                      " " +
                                      item.FastestLap?.AverageSpeed?.units}
                                  - Lap: {item?.FastestLap?.lap} ]
                                </td>
                              ) : (
                                <td className="p-0 text-center">-</td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        : null}

      {season === new Date().getFullYear().toString() ? (
        <Team teamName={sdata[0]?.Results[0]?.Constructor?.name} ls="5" />
      ) : (
        sdata[0]?.Results[0]?.Constructor?.name
      )}
    </div>
  );
};

export default ConstructorsResult;
