import React from "react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
//import ResultsDriver from "./ResultsDriver";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { DrvInfo } from "./DriverInfo";
import Team from "./Team";

const DriverStandings = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [sdata, setData] = useState([]);
  const navigate = useNavigate();

  const dateTime = (d) => new Date(d).toDateString();

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/driverStandings.json`;
  }

  const fetchDriverStandings = useCallback(() => {
    setIsLoaded(false);
    axios
      .get(url)
      .then((res) => {
        setData(
          res.data["MRData"].StandingsTable.StandingsLists[0].DriverStandings
        );
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoaded(true));
  }, [url]);

  useEffect(() => {
    fetchDriverStandings();
  }, [fetchDriverStandings]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="bg-black container-fluid p-0">
        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead className="">
              <tr className="text-black">
                <th scope="col" className="bg-danger text-center">
                  P
                </th>
                <th scope="col" className="text-center bg-danger op">
                  CODE
                </th>
                <th scope="col" className="bg-danger text-center">
                  DRIVER INFO
                </th>
                <th scope="col" className="bg-danger text-center op">
                  POINTS
                </th>
                <th scope="col" className="bg-danger text-center">
                  WINS
                </th>
              </tr>
            </thead>
            <tbody key={indexedDB}>
              {sdata?.map((driver, indexedDB) => {
                return (
                  <tr key={indexedDB} className="align-middle">
                    <td className="text-center fs-5">
                      {driver.position < 4 ? (
                        <i
                          className={
                            "text-info bi bi-" + driver.position + "-square"
                          }
                        ></i>
                      ) : (
                        driver.position
                      )}
                    </td>
                    <td className="text-center op fw-bold text-danger fs-5">
                      {driver.Driver.code}
                    </td>
                    <td
                      className="cp"
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
                      <b className="fs-5 text-info">
                        {driver.Driver.givenName} {driver.Driver.familyName} (
                        {driver.Driver.permanentNumber})
                      </b>{" "}
                      <span className="fw-light">
                        {driver.Driver.nationality} /{" "}
                        {dateTime(driver.Driver.dateOfBirth)}
                      </span>
                      {" / "}
                      <i className="fw-light fs-5">
                        <b className="text-warning">
                          {driver.Constructors[0].name}
                        </b>
                      </i>
                      <i className="fw-light">
                        {" "}
                        {driver.Constructors[0].nationality}
                      </i>
                    </td>
                    <td className="text-center op text-warning">
                      <b>{driver.points}</b>
                    </td>
                    <td className="text-center">{driver.wins}</td>
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

export default DriverStandings;
