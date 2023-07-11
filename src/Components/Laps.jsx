import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DriverId from "./DriverId";

const Laps = () => {
  const [sdata, setData] = useState([]);
  const [dtime, setDtime] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { drvname = "alonso" } = useParams();
  const { season = "2020" } = useParams();
  const { rounds = "1" } = useParams();
  const lapObj = {};

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

  return (
    <div className="container-fluid p-0">
      <Link to="/" className="btn btn-danger container-fluid mb-1">
        <h1>F1</h1>
      </Link>
      <h1 className="text-center text-danger">{sdata.raceName} Lap Time</h1>
      <h2 className="text-center text-danger">
        #{sdata.round} {sdata.season}
      </h2>
      <div className="table-responsive-sm">
        <table className="table table-dark table-striped">
          <thead className="text">
            <tr>
              <th>#</th>
              <th>PST</th>
              <th>Driver</th>
              <th>Time</th>
            </tr>
          </thead>
          {sdata?.Laps?.map((items, index) => {
            items?.Timings.sort((a, b) => (a["time"] > b["time"] ? 1 : -1));

            return (
              <tbody key={index}>
                <tr className="text-center">
                  <td></td>
                  <td></td>
                  <td className="text-danger fs-3">
                    Lap {items?.number} Times
                  </td>
                  <td></td>
                </tr>

                <tr>
                  <th>#</th>
                  <th>PST</th>
                  <th>Driver</th>
                  <th>Time</th>
                </tr>

                {items?.Timings?.map((item, index2) => {
                  return (
                    <tr key={index2}>
                      <td className="col-1 op">{index2 + 1}</td>
                      <td className="col-1 op">{item?.position}</td>
                      <td className="col-8 op">
                        {<DriverId Id={item?.driverId} />}{" "}
                      </td>
                      <td className="col-4">{item?.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};
export default Laps;
