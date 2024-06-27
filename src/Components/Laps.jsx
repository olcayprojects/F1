import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DriverId from "./DriverId";
import Loading from "./Loading";
import Nav from "./Nav";

const Laps = () => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  var drvt = {};
  var drvTimeList = [];

  // const { drvname = "alonso" } = useParams();
  const { season = "2020" } = useParams();
  const { rounds = "1" } = useParams();

  //let url = `https://ergast.com/api/f1/${season}/${rounds}/drivers/${drvname}/laps.json?limit=5000`;

  let url = `https://ergast.com/api/f1/${season}/${rounds}/laps.json?limit=5000`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setIsLoaded(true);

          setData(items["MRData"].RaceTable?.Races[0]);

          // console.log(items["MRData"].RaceTable?.Races[0].Laps);
        })
        .catch((err) => {
          console.log("Hata:", err.message);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="container-fluid p-0">
        <Nav />
        <div className="border border-danger border-5 fs-2 text-center fw-bold m-1">
          <span className="text-center text-danger pe-2">
            {sdata?.raceName} Lap Time
          </span>
          <span className="text-center text-danger">
            #{sdata?.round} {sdata?.season}
          </span>
        </div>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped op table-bordered border-black">
            <thead className="">
              <tr>
                <th className="text-center px-0">#</th>
                <th className="bg-danger text-center px-0">P</th>
                <th className="">Driver Info</th>
                <th className="bg-danger text-center px-0">
                  Time <i className="bi bi-sort-down-alt fs-4"></i>
                </th>
                <th className=" text-center px-0">Lap</th>
              </tr>
            </thead>

            {sdata?.Laps?.map((items, index) => {
              items?.Timings.sort((a, b) => (a["time"] < b["time"] ? 1 : -1));

              items?.Timings?.map((item, index2) => {
                drvt = {
                  drvId: item?.driverId,
                  time: item?.time,
                  lap: items?.number,
                  pst: item?.position,
                };
                drvTimeList.push(drvt);
                drvTimeList?.sort((a, b) => (a["time"] > b["time"] ? 1 : -1));
              });
            })}

            <tbody>
              {drvTimeList.map((drvitem, index3) => {
                return (
                  <tr key={index3} className="bg-danger align-middle">
                    <td className="p-0 text-center">{index3 + 1}</td>
                    <td className="p-0 op text-center">
                      {drvitem?.pst < 4 ? (
                        <i
                          className={
                            "bi bi-" + drvitem?.pst + "-square-fill fs-5"
                          }
                        ></i>
                      ) : (
                        drvitem?.pst
                      )}
                    </td>
                    <td className="py-0">
                      {<DriverId Id={drvitem?.drvId} ls={2} />}
                    </td>
                    <td className="py-0 op text-center">{drvitem?.time}</td>
                    <td className="py-0 text-center">{drvitem?.lap}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};
export default Laps;
