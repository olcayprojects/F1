import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const WinRacesInaSeason = (props) => {
  const [sdata, setData] = useState([]);
  const dateTime = (d, t) => new Date(d + " " + t).toLocaleString();

  let navigate = useNavigate();

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
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead className="">
            <tr className="text-dark">
              <th className="bg-danger">Race Name</th>
              <th className="bg-danger">Driver</th>
              <th className="bg-danger">Constructor</th>
              <th className="bg-danger text-center">Pts</th>
              <th className="bg-danger text-center">Laps</th>
              <th className="bg-danger text-center">Time</th>
              <th className="bg-danger text-center">Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            {sdata?.map((item, index) => {
              return (
                <tr className="bg-dark" key={index}>
                  <td
                    className="col cp"
                    onClick={() =>
                      navigate("/F1Race/" + props.season + "/" + item.round)
                    }
                  >
                    #{item.round} <b>{item.raceName} </b>
                    {item.time ? dateTime(item.date, item.time) : item.date}
                  </td>
                  <td
                    className="col cp text-danger"
                    onClick={() => {
                      navigate(
                        "/ResultsDriver/" + item.Results[0].Driver.driverId
                      );
                    }}
                  >
                    {item.Results[0].Driver.givenName}{" "}
                    {item.Results[0].Driver.familyName}
                  </td>
                  <td className="col text-danger">
                    {item.Results[0].Constructor.name}
                  </td>
                  <td className="col text-center">{item.Results[0].points}</td>

                  <td className="col text-center">{item.Results[0].laps}</td>
                  <td className="col text-center">
                    {item.Results[0].Time.time}
                  </td>

                  <td
                    className={
                      "text-center col " +
                      (item.Results[0].FastestLap?.rank === "1"
                        ? "text-danger"
                        : "")
                    }
                  >
                    #{item.Results[0].FastestLap?.rank}#{" "}
                    {item.Results[0].FastestLap?.Time?.time
                      ? item.Results[0].FastestLap?.Time?.time
                      : " "}{" "}
                    AvgSpd(
                    {item.Results[0].FastestLap?.AverageSpeed?.speed
                      ? item.Results[0].FastestLap.AverageSpeed.speed
                      : " "}
                    )kph Laps(
                    {item.Results[0].FastestLap?.lap
                      ? item.Results[0].FastestLap.lap
                      : " "}
                    )
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WinRacesInaSeason;
