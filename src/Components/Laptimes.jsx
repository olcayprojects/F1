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

  return sdata?.length > 0 ? (
    <table className="table table-dark table-striped">
      <caption className="text-center bg-dark text-danger caption-top">
        <b className="bg-black px-2 p-1">LAP {props.lapsx}</b>
      </caption>
      <thead className="text-white border-dark">
        <tr className="text-black">
          <th className="bg-danger">DRIVER</th>
          <th className="text-center">P</th>
          <th className="bg-danger text-center">TIME</th>
        </tr>
      </thead>
      <tbody>
        {sdata.map((LapTimes, index) => {
          // console.log("aa",LapTimes);

          return (
            <tr key={index} className="">
              <td key={index} className="op text-warning fw-bold">
                {<DriverId Id={LapTimes.driverId} ls={0} />}
                {/* {LapTimes.driverId} */}
              </td>
              <td className="text-center fw-bold">{LapTimes.position}</td>
              <td className="text-center op">{LapTimes.time}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    ""
  );
};

export default Laptimes;
