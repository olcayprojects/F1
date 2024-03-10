import React from "react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
//import ResultsDriver from "./ResultsDriver";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Nav from "./Nav";

const DriverStandings = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [sdata, setData] = useState([]);
  const navigate = useNavigate();

  const dateTime = (d) => new Date(d).toDateString();

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
      <div className="container p-0">
        {props.season ? (
          ""
        ) : (
          <>
            <Nav />
            <h1 className="text-warning text-center">Driver Standings</h1>
          </>
        )}
        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered">
            <thead className="">
              <tr className="text-black">
                <th scope="col" className="bg-danger text-center py-0">
                  P
                </th>
                <th scope="col" className="text-center bg-danger op py-0">
                  CODE
                </th>
                <th scope="col" className="bg-danger py-0">
                  DRIVER
                </th>
                <th scope="col" className="bg-danger text-center op py-0">
                  POINTS
                </th>
                <th scope="col" className="bg-danger text-center py-0">
                  WINS
                </th>
              </tr>
            </thead>
            <tbody key={{}}>
              {sdata?.map((driver, indexedDB) => {
                return (
                  <tr key={driver.Driver.driverId} className="align-middle">
                    <td className="text-center py-0">
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
                    <td className="text-center op text-danger py-0">
                      {driver.Driver.code ? (
                        <span className="bg-black d-block">
                          {driver.Driver.code}
                        </span>
                      ) : null}
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
                      <b className="text-info bg-black px-1">
                        {driver.Driver.givenName} {driver.Driver.familyName}
                        {driver.Driver.permanentNumber
                          ? "(" + driver.Driver.permanentNumber + ")"
                          : null}
                      </b>{" "}
                      <span className="fw-light text-secondary fw-bold">
                        {dateTime(driver.Driver.dateOfBirth)}(
                        {driver.Driver.nationality})
                      </span>
                      <i className="fw-light">
                        <b className="text-warning bg-black px-1 mx-1">
                          {driver.Constructors[0].name}
                        </b>
                      </i>
                      <i className="text-warning">
                        {driver.Constructors[0].nationality}
                      </i>
                    </td>
                    <td className="text-center op text-warning py-0">
                      <span className={"bg-black fw-bold d-block"}>
                        {driver.points}
                      </span>
                    </td>
                    <td className="text-center text-primary py-0">
                      <span className={"bg-black fw-bold d-block"}>
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
    );
  }
};

export default DriverStandings;
