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
        <table className="table table-dark table-striped table-bordered">
          <thead className="">
            <tr className="">
              <th className="bg-danger op">#</th>
              <th className="bg-danger text-center">Race Name</th>
              <th className="bg-danger op text-center">Driver</th>
              <th className="bg-danger text-center">P</th>
              <th className="bg-danger op text-center">Laps</th>
              <th className="bg-danger text-center">Time</th>
              <th className="bg-danger op text-center">Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            {sdata?.map((item, index) => {
              return (
                <tr className="align-middle" key={index}>
                  <td className="p-0 op fw-bold">#{item.round}</td>
                  <td
                    className="col cp"
                    onClick={() =>
                      navigate("/F1Race/" + props.season + "/" + item.round)
                    }
                  >
                    <span className="text-warning bg-black px-2 p-1 fw-bold">
                      {item.raceName}
                    </span>
                    <i className="bg-warning bg-opacity-75 fw-bold text-black px-2 p-1">
                      {item.time ? dateTime(item.date, item.time) : item.date}
                    </i>
                  </td>
                  <td className="col op">
                    <span
                      className="text-info bg-black px-2 p-1 fw-bold cp"
                      onClick={() => {
                        navigate(
                          "/ResultsDriver/" + item.Results[0].Driver.driverId
                        );
                      }}
                    >
                      {item.Results[0].Driver.givenName}{" "}
                      {item.Results[0].Driver.familyName}
                    </span>
                    <span
                      className="fw-bold px-1 text-black bg-info fst-italic cp"
                      onClick={() => {
                        navigate(
                          "/ConstructorsResult/" +
                            item.Results[0].Constructor?.constructorId +
                            "/" +
                            season2
                        );
                      }}
                    >
                      {item.Results[0].Constructor.name}
                    </span>
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
                      (item.Results[0].FastestLap?.rank in [1, 2, 3, 4]
                        ? "text-danger"
                        : null)
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
                      : null}
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
