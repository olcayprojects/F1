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
        console.log(err.message);
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid">

      <hr />
      <h2 className="text-center bg-black text-danger border border-danger border-5">
        Driver Standings
      </h2>

      <table className="table table-dark table-bordered table-hover text-danger border border-danger border-5 ">
      <thead className="text-white">
          <tr>
            <th scope="col">#</th>
            <th scope="col" className="text-center">Code</th>
            <th scope="col">Driver</th>
            <th scope="col">Constructor</th>
            <th scope="col">Points</th>
            <th scope="col">Wins</th>
            <th scope="col">Information-Driver Biography wikipedia</th>
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
                <td className="col">{driver.wins}</td>
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
  );
};

export default DriverStandings;
