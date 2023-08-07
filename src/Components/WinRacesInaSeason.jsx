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
    <div className="bg-black container-fluid p-0">
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead className="fs-5">
            <tr className="text-dark">
              <th className="bg-danger text-center">Race Name</th>
              <th className="bg-danger text-center op">Driver</th>
              <th className="bg-danger text-center">Pts</th>
              <th className="bg-danger op text-center">Laps</th>
              <th className="bg-danger text-center">Time</th>
              <th className="bg-danger op text-center">Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            {sdata?.map((item, index) => {
              return (
                <tr className="" key={index}>
                  <td
                    className="col cp"
                    onClick={() =>
                      navigate("/F1Race/" + props.season + "/" + item.round)
                    }
                  >
                    <b className="fs-5">
                      {" "}
                      #{item.round} {item.raceName}{" "}
                    </b>
                    <i>
                      {item.time ? dateTime(item.date, item.time) : item.date}
                    </i>
                  </td>
                  <td
                    className="col cp op"
                    onClick={() => {
                      navigate(
                        "/ResultsDriver/" + item.Results[0].Driver.driverId
                      );
                    }}
                  >
                    <b className="fs-5">
                      {item.Results[0].Driver.givenName}{" "}
                      {item.Results[0].Driver.familyName}
                    </b>{" "}
                    <i className="fw-light fs-5">
                      {item.Results[0].Constructor.name}
                    </i>
                  </td>
                  <td className="col text-center">{item.Results[0].points}</td>

                  <td className="col text-center op">{item.Results[0].laps}</td>
                  <td className="col text-center">
                    {item.Results[0].Time.time}
                  </td>

                  <td
                    className={
                      "text-center op col " +
                      (item.Results[0].FastestLap?.rank === "1"
                        ? "text-danger"
                        : "")
                    }
                  >
                    {item.Results[0].FastestLap
                      ? item.Results[0].FastestLap?.rank +
                        " | " +
                        "Time: " +
                        item.Results[0].FastestLap?.Time?.time +
                        " | AvgSpd: " +
                        item.Results[0].FastestLap?.AverageSpeed?.speed +
                        " kph | Lap: " +
                        item.Results[0].FastestLap.lap
                      : ""}
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
