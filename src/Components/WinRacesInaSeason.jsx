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
    <div className="container-responsive p-0">
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead className="fs-5">
            <tr className="">
              <th className="bg-danger op">#</th>
              <th className="bg-danger">Race Name</th>
              <th className="bg-danger op">Driver</th>
              <th className="bg-danger text-center">Pts</th>
              <th className="bg-danger op text-center">Laps</th>
              <th className="bg-danger text-center">Time</th>
              <th className="bg-danger op">Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            {sdata?.map((item, index) => {
              return (
                <tr className="align-middle" key={index}>
                  <td className="p-0 op fs-5 fw-bold">#{item.round}</td>
                  <td
                    className="col cp"
                    onClick={() =>
                      navigate("/F1Race/" + props.season + "/" + item.round)
                    }
                  >
                    <b className="fs-5">
                      <span className="text-warning bg-black px-2 p-1">
                        {item.raceName}
                      </span>
                    </b>
                    <i className="bi bi-calendar3 fs-5 ps-1 bg-black"> </i>
                    <i className="bg-black fs-5 fw-bold text-danger px-2 p-1">
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
                    <b className="fs-5 text-info bg-black px-2 p-1">
                      {item.Results[0].Driver.givenName}{" "}
                      {item.Results[0].Driver.familyName}
                    </b>
                    <i className="fw-light fs-5 px-1 text-secondary fw-bold">
                      {item.Results[0].Constructor.name}
                    </i>
                  </td>
                  <td className="col text-center fw-bold">
                    {item.Results[0].points}
                  </td>

                  <td className="col text-center op fw-bold">
                    {item.Results[0].laps}
                  </td>
                  <td className="col text-center fw-bold">
                    {item.Results[0].Time.time}
                  </td>

                  <td
                    className={
                      " op col fw-bold " +
                      (item.Results[0].FastestLap?.rank in [1, 2]
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
