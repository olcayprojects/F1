import React from "react";
import { useEffect, useState } from "react";
import DriverId from "./DriverId";
import { useParams } from "react-router-dom";

const Laptimes = (props) => {
  const [sdata, setData] = useState([]);
  const [number, setNumber] = useState([]);

  const { season2 = "2023" } = useParams();
  const { rounds = 0 } = useParams();

  let urlx = "";
  if (props.season) {
    urlx = `https://ergast.com/api/f1/${props.season}/${props.round}/laps/${props.lapsx}.json`;
  } else {
    urlx = `https://ergast.com/api/f1/${season2}/18/laps.json?limit=100&offset=1000`;
    // urlx = `https://ergast.com/api/f1/${season2}/${rounds}/laps.json`;
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
        setNumber(data["MRData"].RaceTable.Races[0].Laps[0].number);
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

  return sdata ? (
    <table className="table table-dark table-striped table-bordered">
      <caption className="text-center bg-dark text-danger caption-top">
        <span className="fw-bold bg-black px-2 p-1">
          LAP <span className="text-warning">{number}</span>
        </span>
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
  ) : null;
};

export default Laptimes;
