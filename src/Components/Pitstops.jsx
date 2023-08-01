import React from "react";
import { useEffect, useState } from "react";
import DriverId from "./DriverId";

const Pitstops = (props) => {
  const [sdata, setData] = useState([]);

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/${props.round}/pitstops.json?limit=100`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const delay = setTimeout(() => {
          setData(data["MRData"].RaceTable.Races);
        }, 5);
        return () => clearTimeout(delay);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid p-0">
      <div className="table-responsive">
        {sdata?.map((data, index) => {
          return (
            <table key={index} className="table table-dark table-striped">
              <thead className="border-dark">
                <tr className="text-black">
                  <th className="bg-danger op">#</th>
                  <th className="bg-danger">DRIVER NAME</th>
                  <th className="bg-danger text-center op">STOP</th>
                  <th className="bg-danger text-center">LAP</th>
                  <th className="text-center bg-danger op">TIME OF DAY</th>
                  <th className="text-center bg-danger">DURATION</th>
                </tr>
              </thead>
              <tbody className="text-danger">
                {data?.PitStops.map((ps, index) => {
                  return (
                    <tr key={index}>
                      <td className="col op">{index + 1}</td>
                      <td className="col" style={{ textTransform: "" }}>
                        <DriverId Id={ps.driverId} />

                        {/* {ps.driverId}  */}
                      </td>
                      <td className="col text-center op">{ps.stop}</td>
                      <td className="col text-center">{ps.lap}</td>
                      <td className="col text-center op">{ps.time}</td>
                      <td className="col text-center">{ps.duration}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default Pitstops;
