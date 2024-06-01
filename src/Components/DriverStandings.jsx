import React from "react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
//import ResultsDriver from "./ResultsDriver";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Nav from "./Nav";
import { DrvInfo } from "./DriverInfo";

const DriverStandings = (props) => {
  const [isLoaded, setIsLoaded] = useState(true);

  const [driverStandings, setDriverStandings] = useState([]);
  const navigate = useNavigate();

  const dateTime = (d) => {
    return d ? new Date(d).toDateString() : "? ";
  };

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/driverStandings.json`;
  } else {
    url = `https://ergast.com/api/f1/2024/driverStandings.json`;
  }

  const fetchDriverStandings = useCallback(() => {
    setIsLoaded(false);
    axios
      .get(url)
      .then((res) => {
        setDriverStandings(
          res.data["MRData"].StandingsTable.StandingsLists[0].DriverStandings
        );
      })
      .catch((e) => {
        console.log(e);
        return alert("Error: " + e.message);
      })
      .finally((e) => {
        setIsLoaded(true);
      });
  }, [url]);

  useEffect(() => {
    fetchDriverStandings();
  }, [fetchDriverStandings]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="container-fluid p-0">
        {props.season ? (
          ""
        ) : (
          <>
            <Nav />
            <h3 className="text-center py-1 fw-bold m-0">
              <span className="text-black bg-danger px-2 rounded bg-opacity-75">DRIVER STANDINGS</span>
            </h3>
          </>
        )}
        <div className="d-md-flex flex-row align-items-center">
          {driverStandings?.map((driver, indexedDB) => {
            return driver.positionText === "1" ? (
              <div key={indexedDB}>
                <DrvInfo
                  drv={
                    driver.Driver?.givenName + " " + driver.Driver?.familyName
                  }
                  s="1"
                />
              </div>
            ) : null;
          })}

          <div className="table-responsive">
            <table className="table table-dark table-striped table-bordered">
              <thead className="border-danger border-5">
                <tr className="text-black">
                  <th className="bg-dark text-danger text-center py-0">POS</th>
                  <th className="bg-dark text-danger py-0">DRIVER</th>
                  <th className="bg-dark text-danger py-0">CONSTRUCTOR</th>
                  <th className="bg-dark text-danger text-center op py-0">POINTS</th>
                  <th className="bg-dark text-danger text-center py-0">WINS</th>
                </tr>
              </thead>
              <tbody key={{}}>
                {driverStandings?.map((driver, indexedDB) => {
                  return (
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
                      <td className="text-center fw-bold py-0">
                        {driver.position < 2 ? (
                          <i
                            className={
                              "bi bi-" + driver.position + "-square-fill text-danger"
                            }
                          ></i>
                        ) : (
                          driver.position
                        )}
                      </td>
                      <td
                        className="cp py-0"
                        onClick={() => {
                          navigate("/ResultsDriver/" + driver.Driver.driverId);
                        }}
                      >
                        {/* {(driver.position in ["1", "2", "3", "4"]) &
                      (props.season === "2023") ? (
                        <DrvInfo
                          drv={
                            driver.Driver?.givenName +
                            " " +
                            driver.Driver?.familyName
                          }
                        />
                      ) : (
                        ""
                      )} */}
                        <span className="text-info px-1">
                          {driver.Driver.givenName}
                          <b className="ps-1">
                            {driver.Driver.familyName.toUpperCase()}
                          </b>
                        </span>
                        <span className="fw-light fst-italic text-secondary pe-1">
                          {new Date(
                            driver.Driver.dateOfBirth
                          ).toLocaleDateString() +
                            " " +
                            driver.Driver.nationality}
                        </span>
                      </td>
                      <td>
                        <i className="fw-bold">
                          <b className="text-warning px-1 mx-1">
                            {driver.Constructors[0].name.toUpperCase()}
                          </b>
                        </i>
                      </td>
                      <td className="text-center op text-light py-0">
                        <span
                          className={
                            "fw-bold d-block " +
                            (driver?.points === "0" ? "text-secondary" : null)
                          }
                        >
                          {driver.points}
                        </span>
                      </td>
                      <td className="text-center text-primary py-0">
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
};

export default DriverStandings;
