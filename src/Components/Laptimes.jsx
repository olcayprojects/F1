import React from "react";
import { useEffect, useState } from "react";
import DriverId from "./DriverId";
import { useParams } from "react-router-dom";

const Laptimes = (props) => {
  const [sdata, setData] = useState([]);
  const [number, setNumber] = useState([]);

  const { season2 = "2024" } = useParams();
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

  return sdata.length ? (
    <div className="container px-1">

    <table className="table table-dark table-striped table-bordered">
      <caption className="text-center py-1 bg-dark text-danger border-top border-start border-end border-3 border-danger mx-5 caption-top">
        <span className="fw-bold px-2">
          LAP <span className="text-warning">{number}</span>
        </span>
      </caption>
      <thead className="text-white border-dark">
        <tr className="text-black">
          <th className="bg-danger text-center p-0">
            <span className="bg-black text-danger ms-1 px-1">DRIVER</span>
          </th>
          <th className="text-center py-0">
            <span className="bg-black text-danger px-1">P</span>
          </th>
          <th className="bg-danger text-center py-0">
            <span className="bg-black text-danger p-0 px-1">TIME</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {sdata.map((LapTimes, index) => {
          // console.log("aa",LapTimes);

          return (
            <tr key={index} className="">
              {<DriverId Id={LapTimes.driverId} ls={0} />}
              {/* {LapTimes.driverId} */}

              <td className="text-center text-primary fw-bold py-0">
                <span className="bg-black d-block px-1">
                  {LapTimes.position}
                </span>
              </td>
              <td className="text-center op text-success fw-bold py-0 px-1">
                <span className="bg-black px-1">{LapTimes.time}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  ) : props.lapsx == props.laps ? (
    <h4>Lap Times data not found!</h4>
  ) : null;
};

export default Laptimes;
