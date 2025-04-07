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
        <div>
          <select
            className="form-select bg-black text-center fs-4 text-danger border-danger border-5 shadow-none cp mb-1"
            onChange={(e) => {
              setSeas(e.target.value);
            }}
          >
            <option value="" hidden>
              {seas}
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
            className="form-select bg-black text-center fs-4 text-danger border-danger border-5 shadow-none cp mb-1"
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
                    <caption className="text-primary bg-dark text-center fs-4">
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
                        <th className="text-center text-info">P</th>
                        <th className="text-center">G</th>
                        <th className="">DRIVER</th>
                        <th className="text-center">TIME</th>
                        <th className="text-center">STATUS</th>
                        <th className="text-warning text-center">PTS</th>
                        <th className="text-center">LAPS</th>
                        <th className="text-center">FASTEST LAP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isLoaded ? (
                        <Loading />
                      ) : (
                        items?.Results.map((item, index) => {
                          return (
                            <tr key={index} className="">
                              <td className="op text-center text-info p-0 fw-bold">
                                {!isNaN(+item.positionText)
                                  ? item.positionText
                                  : item.position +
                                    " (" +
                                    item.positionText +
                                    ")"}
                              </td>
                              <td className="text-center p-0">{item.grid}</td>
                              <td
                                className="cp op p-0 fw-bold"
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
                              <td className="text-center p-0">
                                {item.Time?.time ? item.Time?.time : "-"}
                              </td>
                              <td className="op text-center p-0">
                                {item.status}
                              </td>
                              <td className="text-center text-warning p-0">
                                {item.points}
                              </td>
                              <td className="text-center op p-0">
                                {item.laps}
                              </td>

                              {item?.FastestLap ? (
                                <td className="p-0 text-center">
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
