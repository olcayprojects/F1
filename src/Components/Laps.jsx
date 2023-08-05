import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DriverId from "./DriverId";
import Loading from "./Loading";

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
        <Link to="/" className="btn container-fluid">
          <h1 className="bg-dark text-danger">F1 Race Results</h1>
        </Link>
        <h1 className="text-center text-danger">{sdata.raceName} Lap Time</h1>
        <h2 className="text-center text-danger">
          #{sdata.round} {sdata.season}
        </h2>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped op fs-5">
            <thead className="text">
              <tr>
                <th className="">#</th>
                <th className="bg-danger">Race PST</th>
                <th className="">Driver</th>
                <th className="bg-danger">
                  Time <i className="bi bi-sort-down-alt fs-4"></i>
                </th>
                <th className="">Lap</th>
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
                  <tr key={index3} className="bg-danger">
                    <td className="col">{index3 + 1}</td>
                    <td className="col op fs-4">
                      {drvitem?.pst < 4 ? (
                        <i
                          className={"bi bi-" + drvitem?.pst + "-circle-fill"}
                        ></i>
                      ) : (
                        drvitem?.pst
                      )}
                    </td>
                    <td className="col">{<DriverId Id={drvitem?.drvId} />}</td>
                    <td className="col op">{drvitem?.time}</td>
                    <td className="col">{drvitem?.lap}</td>
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
