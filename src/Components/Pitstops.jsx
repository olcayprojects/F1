import React from "react";
import { useEffect, useState } from "react";
import DriverId from "./DriverId";

const Pitstops = (props) => {
  const [sdata, setData] = useState([]);

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/${props.round}/pitstops.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);

        // console.log(data["MRData"].RaceTable.Races);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid">

      <h1 className="text-center bg-black text-danger border border-danger border-5 mb-2">
        Pit Stops
      </h1>
      {sdata?.map((data, index) => {
        return (
          <table key={index} className="table  table-bordered table-dark bg-dark table-hover h-100 border border-danger border-5">
            <thead className="text-white">
              <tr>
               
                <th className="text-end">Driver</th>
                <th>Stop</th>
                <th>Lap</th>
                <th className="text-center">Time</th>
                <th className="text-center">Duration</th>
              </tr>
            </thead>
            <tbody className="text-danger">
              {data?.PitStops.map((ps, index) => {
                return (
                  <tr key={index}>
                    <td className="col-5 text-end">
                      <DriverId Id={ps.driverId} />
                    </td>
                    <td className="col">{ps.stop}</td>
                    <td className="col">{ps.lap}</td>
                    <td className="col-3 text-center">{ps.time}</td>
                    <td className="col-3 text-center">{ps.duration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      })}
    </div>
  );
};

export default Pitstops;
