import React from "react";
import { useEffect, useState } from "react";
import DriverId from "./DriverId";

const Laptimes = (props) => {
  const [sdata, setData] = useState([]);

  let urlx = "";
  if (props.season) {
    urlx = `https://ergast.com/api/f1/${props.season}/${props.round}/laps/${props.lapsx}.json`;
  }

  const fetchData = async (url) => {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(
          data["MRData"].RaceTable.Races[0].Laps[0].Timings.sort((a, b) =>
            a["time"] > b["time"] ? 1 : -1
          )
        );

        // console.log(data["MRData"].RaceTable.Races[0].Laps);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  };

  useEffect(() => {
    fetchData(urlx);
  }, [urlx]);

  return (
    <table className="table  caption-top table-dark table-bordered table-hover text-danger border border-danger border-2">
      <caption className="text-center bg-dark text-danger">
        <b>LAP {props.lapsx}</b>
      </caption>
      <thead className="text-white border-dark">
        <tr className="text-black">
          <th  className="bg-danger text-center">
            DRIVER NAME
          </th>
          <th  className="bg-danger">
            POS
          </th>
          <th  className="bg-danger text-center">
            TIME
          </th>
        </tr>
      </thead>
      {sdata.map((LapTimes, index) => {
        // console.log("aa",LapTimes);

        return (
          <tbody key={index}>
            <tr key={index} className="">
              <td key={index} className="col-5">
                {<DriverId Id={LapTimes.driverId} />}
              </td>
              <td className="col-1 text-center">{LapTimes.position}</td>
              <td className="col-1 text-center">{LapTimes.time}</td>
            </tr>
          </tbody>
        );
      })}
    </table>
  );
};

export default Laptimes;
