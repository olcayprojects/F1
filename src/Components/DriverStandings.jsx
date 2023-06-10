import React from "react";
import { useEffect, useState } from "react";

const DriverStandings = (props) => {
  const [sdata, setData] = useState([]);

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/${props.round}/driverStandings.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(
          data["MRData"].StandingsTable.StandingsLists[0].DriverStandings
        );
        // console.log(data["MRData"].StandingsTable.StandingsLists[0].DriverStandings);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid">
      <hr />
      <h1 className="text-center bg-black text-danger border border-danger border-5">
        Driver Standings
      </h1>
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
              <th scope="col" className="bg-danger">
                DRIVER
              </th>
              <th scope="col" className="bg-danger">
                CONSTRUCTOR
              </th>
              <th scope="col" className="bg-danger">
                POINTS
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
                  <td className="col-1 text-center">{driver.Driver.code}</td>
                  <td className="col-3">
                    {driver.Driver.givenName} {driver.Driver.familyName} (
                    {driver.Driver.nationality})
                  </td>
                  <td className="col-3">
                    {driver.Constructors[0].name} (
                    {driver.Constructors[0].nationality})
                  </td>
                  <td className="col">{driver.points}</td>
                  <td className="col text-center">{driver.wins}</td>
                  <td className="col">
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
};

export default DriverStandings;
