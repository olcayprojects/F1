import React from "react";
import { useEffect, useState } from "react";
import DriverId from "./DriverId";

const Pitstops = (props) => {
  const [sdata, setData] = useState([]);

  const initialList = [];

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
        });
        return () => clearTimeout(delay);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  return (
    <div className="bg -black container p-0">
      <div className="table-responsive">
        {sdata?.map((data, index) => {
          return (
            <table key={index} className="table table-dark table-striped">
              <thead className="border-dark fs-5">
                <tr className="text-black">
                  <th className="bg-danger op">#</th>
                  <th className="bg-danger">DRIVER INFO</th>
                  <th className="bg-danger text-center op">STOPS</th>
                  <th className="bg-danger text-center">LAP</th>
                  <th className="text-center bg-danger op">TIME OF DAY</th>
                  <th className="text-center bg-danger">DURATION</th>
                </tr>
              </thead>
              <tbody className="text-danger">
                {data?.PitStops.map((ps, index) => {
                  return (
                    <tr key={index} className="align-middle">
                      <td className="op">{index + 1}</td>
                      <td
                        className="col-5 fw-bold text-info"
                        style={{ textTransform: "" }}
                      >
                        <DriverId Id={ps.driverId} ls={1}></DriverId>
                        {/* {ps.driverId} */}
                      </td>
                      <td className="col-1 text-center op">{ps.stop}</td>
                      <td className="col-1 text-center">{ps.lap}</td>
                      <td className="col-3 text-center op">{ps.time}</td>
                      <td className="col-3 text-center fw-bold">
                        {ps.duration}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        })}
      </div>
    </div>
  );
};

export default Pitstops;
