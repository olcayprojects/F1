// DriverStandings.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Nav from "./Nav";
import { DrvInfo } from "./DriverInfo";
import { fetchDriverStandings, setYear } from "../redux/driverStandingsSlice";

const DriverStandings = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { standings, year, isLoading } = useSelector(
    (state) => state.driverStandings
  );

  useEffect(() => {
    dispatch(fetchDriverStandings(props.season || year));
  }, [dispatch, year, props.season]);

  const handleYearChange = (e) => {
    dispatch(setYear(e.target.value));
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container-fluid">
      {props.tab !== "1" && <Nav />}
      <div className="d-flex align-items-center justify-content-center">
        <select
          className="px-4 w-auto bg-black text-danger border-danger fw-bold fs-4 me-1 px-2"
          value={year}
          onChange={handleYearChange}
        >
          {Array.from(
            { length: 2025 - 1950 + 1 },
            (_, index) => 2025 - index
          ).map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
        <h2 className="text-center fw-bold m-0 text-danger">
          DRIVER STANDINGS
        </h2>
      </div>

      <div className="d-block align-items-center">
        {standings?.map((driver, indexedDB) => {
          return driver.positionText === "1" ? (
            <div key={indexedDB}>
              <DrvInfo
                drv={driver.Driver?.givenName + " " + driver.Driver?.familyName}
                s="1"
              />
            </div>
          ) : null;
        })}

        <div className="table-responsive me-1">
          <table className="myTable table table-dark table-striped table-bordered border-dark">
            <thead className="border-5 fs-6">
              <tr>
                <th className="text-center py-0">P</th>
                <th className="text-black bg-info py-0 op">DRIVER INFO</th>
                <th className="py-0 bg-warning text-black">CONSTRUCTOR</th>
                <th className="text-center op py-0 bg-light text-black">
                  POINTS
                </th>
                <th className="text-center py-0 bg-primary text-black">WINS</th>
              </tr>
            </thead>
            <tbody>
              {standings?.map((driver) => (
                <tr
                  key={driver.Driver.driverId}
                  className={
                    "align-middle " +
                    (driver.position === "1"
                      ? "fs-5"
                      : driver.position === "2"
                      ? "fs-6"
                      : null)
                  }
                >
                  <td className="text-center fw-bold py-0 op">
                    {driver.position < 2 ? (
                      <i
                        className={
                          "bi bi-" +
                          driver.position +
                          "-square-fill text-danger"
                        }
                      ></i>
                    ) : (
                      driver.position || driver.positionText
                    )}
                  </td>
                  <td
                    className="cp py-0 fw-bold"
                    onClick={() => {
                      navigate("/ResultsDriver/" + driver.Driver.driverId);
                    }}
                  >
                    <span className="text-info px-1 bg-black">
                      {driver.Driver.givenName}
                      <b className="ps-1">
                        {driver.Driver.familyName.toUpperCase()}
                      </b>
                    </span>
                    <span className="text-info opacity-25 bg-black">
                      {driver.Driver.code &&
                        `(${
                          driver.Driver.permanentNumber
                            ? "#" + driver.Driver.permanentNumber
                            : ""
                        })`}
                    </span>
                    <span className="fw-light opacity-25 fst-italic text-info bg-black pe-2">
                      {driver.Driver.dateOfBirth +
                        " " +
                        driver.Driver.nationality.toUpperCase()}
                    </span>
                  </td>
                  <td className="op fw-bold fst-italic text-warning py-0 ps-2">
                    <span className="bg-black px-2">
                      {driver.Constructors[0].name.toUpperCase()}
                    </span>
                    <span className="ps-2 opacity-25 text-warning-emphasis bg-warning-subtle px-2">
                      {driver.Constructors[0].nationality.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-center text-light py-1">
                    <span
                      className={
                        "fw-bold d-block " +
                        (driver?.points === "0" ? "text-secondary" : "bg-black")
                      }
                    >
                      {driver.points}
                    </span>
                  </td>
                  <td className="text-center text-primary py-1 op">
                    <span
                      className={
                        "fw-bold d-block " +
                        (driver?.wins === "0" ? "text-secondary" : "bg-black")
                      }
                    >
                      {driver.wins}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverStandings;
