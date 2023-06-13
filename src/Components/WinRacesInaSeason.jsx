import react, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const WinRacesInaSeason = (props) => {
  const [sdata, setData] = useState([]);
  const dateTime = (d, t) => new Date(d + " " + t).toLocaleString();

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
      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover text-danger border border-danger border-5 ">
          <thead className="border-dark">
            <tr className="text-dark">
              <th className="bg-danger text-center">Race Name</th>
              <th className="bg-danger">Driver</th>
              <th className="bg-danger">Constructor</th>
              <th className="bg-danger">Pts</th>
              <th className="bg-danger">Laps</th>
              <th className="bg-danger text-center">Time</th>
              <th className="bg-danger text-center">Fastest Lap</th>
            </tr>
          </thead>
          {sdata?.map((item, index) => {
            return (
              <tbody key={index}>
                <tr className="bg-dark">
                  <td className="col">
                    #{item.round} <b>{item.raceName} </b>
                    {item.time ? dateTime(item.date, item.time) : item.date}
                  </td>
                  <td className="col">
                    {item.Results[0].Driver.givenName}{" "}
                    {item.Results[0].Driver.familyName}
                  </td>
                  <td className="col">{item.Results[0].Constructor.name}</td>
                  <td className="col">{item.Results[0].points}</td>

                  <td className="col">{item.Results[0].laps}</td>
                  <td className="col">{item.Results[0].Time.time}</td>

                  <td className={
                            "text-center col " +
                            (item.Results[0].FastestLap?.rank === "1" ? "bg-black" : "")
                          }>
                    Avg Speed(
                    {item.Results[0].FastestLap?.AverageSpeed?.speed
                      ? item.Results[0].FastestLap.AverageSpeed.speed
                      : " "}
                    )kph Laps(
                    {item.Results[0].FastestLap?.lap
                      ? item.Results[0].FastestLap.lap
                      : " "}
                    ) Time(
                    {item.Results[0].FastestLap?.Time?.time
                      ? item.Results[0].FastestLap?.Time?.time
                      : " "}
                    ) Rank({item.Results[0].FastestLap?.rank})
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default WinRacesInaSeason;
