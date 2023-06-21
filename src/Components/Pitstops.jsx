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

  //  console.log(DriverId({ Id: "alonso" }));
  return (
    <div className="bg-black container-fluid">
      <div className="table-responsive">
        {sdata?.map((data, index) => {
          return (
            <table
              key={index}
              className="table  table-bordered table-dark bg-dark table-hover h-100 border border-danger border-5"
            >
              <thead className="border-dark">
                <tr className="text-black">
                  <th className="text-center bg-danger">DRIVER NAME</th>
                  <th className="bg-danger text-center">STOP</th>
                  <th className="bg-danger text-center">LAP</th>
                  <th className="text-center bg-danger">TIME</th>
                  <th className="text-center bg-danger">DURATION</th>
                </tr>
              </thead>
              <tbody className="text-danger">
                {data?.PitStops.map((ps, index) => {
                  return (
                    <tr key={index}>
                      <td className="col-2" style={{ textTransform: "" }}>
                        <DriverId Id={ps.driverId} />

                        {/* {ps.driverId}  */}
                      </td>
                      <td className="col-1 text-center">{ps.stop}</td>
                      <td className="col-1 text-center">{ps.lap}</td>
                      <td className="col-4 text-center">{ps.time}</td>
                      <td className="col-4 text-center">{ps.duration}</td>
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
