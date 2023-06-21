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
      <div className="bg-black container-fluid">
        <div className="table-responsive">
          <table className="table table-dark table-bordered table-hover text-danger border border-danger border-5 ">
            <thead className="border-dark">
              <tr className="text-black">
                <th scope="col" className="bg-danger">
                  P
                </th>
                <th scope="col" className="text-center bg-danger">
                  CODE
                </th>
                <th scope="col" className="bg-danger text-center">
                  DRIVER INFO
                </th>
                <th scope="col" className="bg-danger">
                  CONSTRUCTOR
                </th>
                <th scope="col" className="bg-danger">
                  PTS
                </th>
                <th scope="col" className="bg-danger">
                  WINS
                </th>
                <th scope="col" className="bg-danger">
                  INFORMATION-DRIVER BIOGRAPHY WIKIPEDIA
                </th>
              </tr>
            </thead>
            {sdata?.map((driver, indexedDB) => {
              return (
                <tbody key={indexedDB}>
                  <tr key={indexedDB}>
                    <td className="col">{driver.position}</td>
                    <td className="col text-center">{driver.Driver.code} </td>
                    <td
                      className="col-3 cp"
                      onClick={() => {
                        navigate(
                          "/ResultsDriver/" +
                            props.season +
                            "/" +
                            driver.Driver.driverId
                        );
                      }}
                    >
                      <b>
                        {driver.Driver.givenName} {driver.Driver.familyName}
                      </b>{" "}
                      ({driver.Driver.nationality}) {driver.Driver.dateOfBirth}
                      {driver.position in ["1", "2", "3", "4"] ? (
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
                    </td>
                    <td className="col-4 align-middle">
                      <b>{driver.Constructors[0].name}</b> (
                      {driver.Constructors[0].nationality})
                      {driver.position in ["1", "2", "3", "4"] ? (
                        <Team teamName={driver?.Constructors[0].name} />
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="col align-middle">{driver.points}</td>
                    <td className="col align-middle text-center">
                      {driver.wins}
                    </td>
                    <td className="col align-middle">
                      <a href={driver.Driver.url} className="link-danger">
                        {driver.Driver.url}
                      </a>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
    );
  }
};

export default DriverStandings;
