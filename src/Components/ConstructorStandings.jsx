import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Loading from "./Loading";
import Team from "./Team";
import {
  fetchConstructorStandings,
  setYear,
} from "../redux/constructorStandingsSlice";

import {
  fetchDriverStandings,
  setYear as setDriverYear,
} from "../redux/driverStandingsSlice";

const ConstructorStandings = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { standings, prevStandings, year, isLoading } = useSelector(
    (state) => state.constructorStandings
  );

  const driver = useSelector((state) => state.driverStandings);

  const [constructor, setConstructor] = useState(null);

  useEffect(() => {
    const yearOrSeason = props.season || year;
    dispatch(fetchConstructorStandings(yearOrSeason));
    dispatch(fetchDriverStandings(yearOrSeason));
  }, [dispatch, year, props.season]);

  const handleYearChange = (e) => {
    dispatch(setYear(e.target.value));
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container-fluid bg-black p-0">
      {props.tab !== 1 && <Nav />}

      {!props.season && (
        <div className="d-flex align-items-center justify-content-center  animate__zoomInDown animate__animated animate__slower">
          <select
            className="px-4 w-auto bg-black text-danger border-danger fw-bold fs-4 me-1 px-2"
            value={year}
            onChange={handleYearChange}
          >
            {Array.from(
              { length: new Date().getFullYear() - 1950 + 1 },
              (_, index) => new Date().getFullYear() - index
            ).map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
          <h2 className="text-center fw-bold m-0 text-danger">
            CONSTRUCTOR STANDINGS
          </h2>
        </div>
      )}

      {/* {year == new Date().getFullYear() && constructor && (
          <div className="container-fluid d-flex flex-column justify-content-center align-items-center fw-bold">
            <img
              src={constructor?.strBadge + "/small"}
              alt=""
              title={constructor?.strDescriptionEN}
              className="img-fluid"
            />
            <h4 className="text-warning-emphasis m-0 fw-bold">
              {constructor?.strTeam}-{constructor?.intFormedYear}
            </h4>
            <h4 className="text-warning-emphasis m-0 fw-bold">
              {constructor?.strLocation}
            </h4>
          </div>
        )} */}

      <div
        className="table-responsive 
      animate__jackInTheBox animate__animated animate__slower"
      >
        <table className="myTable table table-dark table-striped table-bordered border-dark">
          <thead className="">
            <tr>
              <th className="bg-light text-center text-black">POS</th>
              <th className="bg-warning op text-black">CONSTRUCTOR</th>
              <th className="bg-info text-end op text-black">POINTS</th>
              <th className="bg-primary text-black">WINS</th>
            </tr>
          </thead>
          <tbody>
            {standings?.map((cs) => {
              const prev = prevStandings.find(
                (prevCs) =>
                  prevCs.Constructor.constructorId ===
                  cs.Constructor.constructorId
              );

              const relatedDrivers = driver.standings.filter((d) =>
                d.Constructors.some(
                  (constructor) =>
                    constructor.constructorId === cs.Constructor.constructorId
                )
              );

              let change = 0;
              if (prev) {
                change = parseInt(prev.position) - parseInt(cs.position);
              }

              const renderChange = () => {
                if (!prev || change === 0) return null;
                return (
                  <span
                    className={`ms-1 fw-normal ${
                      change > 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {change > 0 ? "↑" : "↓"}
                    {Math.abs(change)}
                  </span>
                );
              };

              return (
                <tr key={cs.Constructor.constructorId}>
                  <td className="text-center fw-bold py-0 align-middle">
                    {cs.position}
                    {renderChange()}
                  </td>
                  <td className="op fw-bold text-warning py-0">
                    <span
                      className="px-1 cp bg-black"
                      onClick={() =>
                        navigate(
                          "/ConstructorsResult/" +
                            cs.Constructor.constructorId +
                            "/" +
                            (props.season || year)
                        )
                      }
                    >
                      {cs.Constructor.name.toUpperCase()}
                      {cs.position < 11 && (
                        <Team
                          teamName={cs.Constructor.name}
                          constructor={setConstructor}
                          ls={2}
                        />
                      )}
                    </span>
                    <span className="px-2 text-center bg-warning-subtle text-black fw-light fst-italic py-0">
                      {cs.Constructor.nationality}
                    </span>
                    <span className="px-2 text-info">
                      {relatedDrivers
                        .map(
                          (d) =>
                            d.Driver.givenName +
                            " " +
                            d.Driver.familyName +
                            " (" +
                            d.positionText +
                            ")"
                        )
                        .join(" & ")}
                    </span>
                  </td>
                  <td className="text-end op text-info py-1 align-middle">
                    <span
                      className={
                        "d-block fw-bold pe-2 " +
                        (cs.points === "0" ? "text-secondary" : "bg-black")
                      }
                    >
                      {cs.points}
                    </span>
                  </td>
                  <td className="text-primary fw-bold align-middle">
                    <span
                      className={
                        "d-block ps-2 " +
                        (cs.wins === "0" ? "text-secondary" : "bg-black")
                      }
                    >
                      {cs.wins}
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
};

export default ConstructorStandings;
