import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DriverId from "./DriverId";

const Laps = () => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { drvname = "alonso" } = useParams();
  const { season = "2020" } = useParams();
  const { rounds = "1" } = useParams();
  const lapObj = {};

  let url = `https://ergast.com/api/f1/${season}/${rounds}/drivers/${drvname}/laps.json?limit=5000`;

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
      <h1 className="text-center text-danger">{sdata.raceName}</h1>
      <h2 className="text-center text-danger">
        {sdata.season}#{sdata.round}
      </h2>
      <div className="table-responsive-sm">
        <table className="table table-dark table-striped">
          <thead className="text">
            <tr>
              <th>Lap</th>
              <th>Driver</th>
              <th>Time</th>
              <th>PST</th>
            </tr>
          </thead>
          <tbody>
            {sdata?.Laps?.map((items, index) => {
              return (
                <tr>
                  <td className="col">{items?.number}</td>
                  <td className="col op">
                    {<DriverId Id={items?.Timings[0]?.driverId} />}{" "}
                  </td>
                  <td className="col">{items?.Timings[0]?.time}</td>
                  <td className="col op">{items?.Timings[0]?.position}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Laps;
