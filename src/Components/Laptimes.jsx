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
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData(urlx);
  }, [urlx]);

  return (
    <div className="bg-black container-fluid">
      <div className="row row-cols-1 row-cols-md-3 g-1 justify-content-md-center">
        <table className="table  caption-top table-dark table-bordered table-hover text-danger border border-danger border-2">
        <caption>Lap {props.lapsx}</caption>
          <thead className="text-white border-dark">
            <tr className="text-black">
              <th scope="col" className="bg-danger text-center">DRV</th>
              <th scope="col" className="bg-danger">
                POS
              </th>
              <th scope="col" className="bg-danger">TIME</th>
            </tr>
          </thead>
          {sdata.map((LapTimes, index) => {
            // console.log("aa",LapTimes);

            return (
              <tbody key={index}>
                <tr key={index} className="">
                  <td key={index} className="col">
                    {<DriverId Id={LapTimes.driverId} />}

                  </td>
                  <td className="col text-center">{LapTimes.position}</td>
                  <td className="col">{LapTimes.time}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default Laptimes;
