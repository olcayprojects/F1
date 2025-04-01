import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Nav from "./Nav";
import { DrvInfo } from "./DriverInfo";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DriverStandings = (props) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [driverStandings, setDriverStandings] = useState([]);
  const [year, setYear] = useState("2025");
  const navigate = useNavigate();

  let url = "";
  if (props.season) {
    url = `${BASE_URL}/${props.season}/driverStandings.json`;
  } else {
    url = `${BASE_URL}/${year}/driverStandings.json`;
  }

  useEffect(() => {
    setIsLoaded(false);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDriverStandings(
          data["MRData"].StandingsTable.StandingsLists[0].DriverStandings
        );
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Fetch error: ", err);
        setIsLoaded(true);
      });
  }, [url, year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  if (!isLoaded) return <Loading />;

  return (
    <div className="container-fluid p-0">
      {props.tab !== "1" && <Nav />}

      {!year ? (
        ""
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-center">
            <select
              className="px-4 w-auto bg-black text-danger border-danger fw-bold fs-4 me-1 px-2 p-0"
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
            <h2 className="text-center  fw-bold m-0 text-danger">
              DRIVER STANDINGS
            </h2>
          </div>
        </>
      )}

      <div className="d-block align-items-center">
        {driverStandings?.map((driver, indexedDB) => {
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
          <table className="table table-dark table-striped">
            <thead className="border-5 fs-5">
              <tr className="">
                <th className="text-center py-0">P</th>
                <th className="text-center py-0 op">DRIVER</th>
                <th className="py-0">CONSTRUCTOR</th>
                <th className="text-center op py-0">POINTS</th>
                <th className="text-center py-0">WINS</th>
              </tr>
            </thead>
            <tbody>
              {driverStandings?.map((driver) => (
                <tr
                  key={driver.Driver.driverId}
                  className={
                    "align-middle " +
                    (driver.position === "1"
                      ? "fs-3"
                      : driver.position === "2"
                      ? "fs-4"
                      : driver.position === "3"
                      ? "fs-5"
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
                    className="cp py-0"
                    onClick={() => {
                      navigate("/ResultsDriver/" + driver.Driver.driverId);
                    }}
                  >
                    <span className="text-info px-1">
                      {driver.Driver.givenName}
                      <b className="ps-1">
                        {driver.Driver.familyName.toUpperCase()}
                      </b>
                    </span>
                    <span className="text-success">
                      {driver.Driver.code &&
                        `(${driver.Driver.code}${
                          driver.Driver.permanentNumber
                            ? "#" + driver.Driver.permanentNumber
                            : ""
                        })`}
                    </span>

                    <span className="fw-light fst-italic text-secondary pe-1">
                      {new Date(driver.Driver.dateOfBirth).toLocaleString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }
                      ) +
                        " " +
                        driver.Driver.nationality}
                    </span>
                  </td>
                  <td className="op">
                    <i className="fw-bold">
                      <b className="text-warning px-1 mx-1">
                        {driver.Constructors[0].name.toUpperCase()}
                      </b>
                    </i>
                  </td>
                  <td className="text-center text-light py-0">
                    <span
                      className={
                        "fw-bold d-block " +
                        (driver?.points === "0" ? "text-secondary" : null)
                      }
                    >
                      {driver.points}
                    </span>
                  </td>
                  <td className="text-center text-primary py-0 op">
                    <span
                      className={
                        "fw-bold d-block " +
                        (driver?.wins === "0" ? "text-secondary" : null)
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
