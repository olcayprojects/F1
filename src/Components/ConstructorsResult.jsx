import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DriverId from "./DriverId";
import Loading from "./Loading";

const ConstructorsResult = () => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { constructors = "red_bull" } = useParams();
  const { season = "2020" } = useParams();

  let url = `https://ergast.com/api/f1/${season}/constructors/${constructors}/results.json`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setIsLoaded(true);

          setData(items["MRData"].RaceTable?.Races);
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
      <div>
        <div className="container-fluid p-0">
          <Link to="/" className="btn btn-danger container-fluid mb-1">
            <h1>F1</h1>
          </Link>
        </div>
        <h1 className="text-danger text-center">{sdata[0]?.Results[0]?.Constructor?.name}</h1>
        {sdata.map((items, index) => {
          return (
            <div className="text-danger" key={index}>
              <h2 className="text-center">
                {items.raceName} Round#{items.round}
                 {" "+items.date}
              </h2>
              <table className="table table-striped table-dark">
                <thead>
                  <tr>
                    <th>DRIVER</th>
                    <th>Time</th>
                    <th>STATUS</th>
                    <th>Fastest Lap</th>
                    <th>LAPS</th>
                    <th>GRID</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.Results.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {item.Driver.givenName} {item.Driver.familyName} (
                          {item.positionText})
                        </td>
                        <td>{item.Time?.time}</td>
                        <td>{item.status}</td>
                        <td>#{item.FastestLap.rank}#-{item.FastestLap.Time.time}-{item.FastestLap.AverageSpeed.speed}-{item.FastestLap.lap}</td>
                        <td>{item.laps}</td>
                        <td>{item.grid}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  }
};

export default ConstructorsResult;
