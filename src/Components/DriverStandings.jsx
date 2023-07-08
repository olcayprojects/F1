import React from "react";
import { useEffect, useState } from "react";
//import ResultsDriver from "./ResultsDriver";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { DrvInfo } from "./DriverInfo";
import Team from "./Team";

const DriverStandings = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [sdata, setData] = useState([]);
  const navigate = useNavigate();

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/driverStandings.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setIsLoaded(true);
        setData(
          data["MRData"].StandingsTable.StandingsLists[0].DriverStandings
        );
        // console.log(data["MRData"].StandingsTable.StandingsLists[0].DriverStandings);
      })
      .catch((err) => {
        setIsLoaded(true);

        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

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
                <th scope="col" className="bg-danger">
                  DRIVER INFO
                </th>
                <th scope="col" className="bg-danger text-center op">
                  PTS
                </th>
                <th scope="col" className="bg-danger text-center">
                  WINS
                </th>
              </tr>
            </thead>
            <tbody key={indexedDB}>
              {sdata?.map((driver, indexedDB) => {
                return (
                  <tr key={indexedDB}>
                    <td className="col align-middle text-center">
                      {driver.position}
                    </td>
                    <td className="col text-center align-middle op">
                      {driver.Driver.code}{" "}
                    </td>
                    <td
                      className="col cp"
                      onClick={() => {
                        navigate("/ResultsDriver/" + driver.Driver.driverId);
                      }}
                    >
                      {(driver.position in ["1", "2", "3", "4"]) &
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
                      )}
                      <b className="fs-5">
                        {driver.Driver.givenName} {driver.Driver.familyName}
                      </b>{" "}
                      <span>
                        {driver.Driver.nationality} {driver.Driver.dateOfBirth}
                      </span>{" "}
                      <i className="fw-light fs-5">
                        {driver.Constructors[0].name}
                      </i>
                      <i> {driver.Constructors[0].nationality}</i>
                    </td>
                    <td className="col align-middle text-center op">
                      <b>{driver.points}</b>
                    </td>
                    <td className="col align-middle text-center">
                      {driver.wins}
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
