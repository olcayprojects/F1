import react, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const WinRacesInaSeason = (props) => {
  const [sdata, setData] = useState([]);

  const { season2 = "2023" } = useParams();
  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${season2}/results/1.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid">
      <h1 className="text-center bg-black text-danger border border-danger border-5 mb-2">
        Drivers and Constructors Winning Races In a Season {season2}
      </h1>
      <div className="row row-cols-1 row-cols-md-3 g-2 justify-content-md-center bg-black">
        {sdata?.map((item, index) => {
          return (
            <div key={index} className="col mb-1">
              <ul className="list-group list-group-mine">
                <li className="list-group-item bg-danger text-black">
                  <b>
                    Round#{item.round} {item.raceName} ({item.date})
                  </b>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center bg-dark text-danger">
                  <b>
                    <u>
                      {item.Results[0].Driver.givenName}{" "}
                      {item.Results[0].Driver.familyName}
                    </u>
                  </b>
                  <i>({item.Results[0].Constructor.name})</i>
                  <span className="badge badge-primary badge-pill">
                    +{item.Results[0].points} point
                  </span>
                </li>
                <li className="list-group-item bg-dark text-danger">
                  Laps: <b>{item.Results[0].laps}</b> Time:{" "}
                  <b>{item.Results[0].Time.time}</b>
                </li>
                <li className="list-group-item bg-dark text-danger">
                  Avg Speed:
                  <b>
                    {item.Results[0].FastestLap?.AverageSpeed?.speed
                      ? item.Results[0].FastestLap.AverageSpeed.speed
                      : " "}
                    kph
                  </b>{" "}
                  Fastest Lap:
                  <b>
                    {item.Results[0].FastestLap?.lap
                      ? item.Results[0].FastestLap.lap
                      : " "}
                  </b>{" "}
                  Time:
                  <b>
                    {item.Results[0].FastestLap?.Time?.time
                      ? item.Results[0].FastestLap?.Time?.time
                      : " "}
                  </b>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default WinRacesInaSeason;
