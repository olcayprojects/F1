import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading";

const WinRacesInaSeason = (props) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [seasonResults, setSeasonResults] = useState([]);
  const dateTime = (d, t) => new Date(d + " " + t).toLocaleString();

  let navigate = useNavigate();

  const { season2 = "2024" } = useParams();
  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/results/1.json`;
  }

  useEffect(() => {
    setIsLoaded(false);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSeasonResults(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((e) => {
        setIsLoaded(true);
      });
  }, [url]);
  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="container-responsive p-0">
        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered">
            <thead className="">
              <tr className="">
                <th className="bg-danger op py-0">#</th>
                <th className="bg-danger text-center py-0">Race Name</th>
                <th className="bg-danger op text-center py-0">Driver</th>
                <th className="bg-danger text-center py-0">P</th>
                <th className="bg-danger op text-center py-0">Laps</th>
                <th className="bg-danger text-center py-0">Time</th>
                <th className="bg-danger op text-center py-0">Fastest Lap</th>
              </tr>
            </thead>
            <tbody>
              {seasonResults?.map((item, index) => {
                return (
                  <tr className="align-middle" key={index}>
                    <td className="op fw-bold py-0">#{item.round}</td>
                    <td
                      className="col cp py-0"
                      onClick={() =>
                        navigate("/F1Race/" + props.season + "/" + item.round)
                      }
                    >
                      <span className="text-warning bg-black px-2 fw-bold">
                        {item.raceName}
                      </span>
                      <i className="bg-warning bg-opacity-75 fw-bold text-black px-2">
                        {item.time ? dateTime(item.date, item.time) : item.date}
                      </i>
                    </td>
                    <td className="col op py-0">
                      <span
                        className="text-info bg-black px-2 fw-bold cp"
                        onClick={() => {
                          navigate(
                            "/ResultsDriver/" + item.Results[0].Driver.driverId
                          );
                        }}
                      >
                        {item.Results[0].Driver.givenName +
                          " " +
                          item.Results[0].Driver.familyName.toUpperCase()}
                      </span>
                      <span
                        className="fw-bold px-2 text-black bg-info fst-italic cp"
                        onClick={() => {
                          navigate(
                            "/ConstructorsResult/" +
                              item.Results[0].Constructor?.constructorId +
                              "/" +
                              season2
                          );
                        }}
                      >
                        {item.Results[0].Constructor.name.toUpperCase()}
                      </span>
                    </td>
                    <td className="col text-center fw-bold py-0">
                      <span className="px-1">{item.Results[0].points}</span>
                    </td>

                    <td className="col text-center op fw-bold py-0">
                      <span className="px-1">{item.Results[0].laps}</span>
                    </td>
                    <td className="col text-center fw-bold py-0">
                      <span className="px-1">{item.Results[0].Time.time}</span>
                    </td>

                    <td
                      className={
                        "text-center op col fw-bold py-0 " +
                        (item.Results[0].FastestLap?.rank in [1, 2, 3, 4]
                          ? "text-primary"
                          : "text-success")
                      }
                    >
                      {item.Results[0].FastestLap ? (
                        <span className="px-2">
                          {item.Results[0].FastestLap
                            ? item.Results[0].FastestLap?.rank +
                              " => " +
                              "Time: " +
                              item.Results[0].FastestLap?.Time?.time +
                              " | AvgSpd: " +
                              item.Results[0].FastestLap?.AverageSpeed?.speed +
                              " kph | Lap: " +
                              item.Results[0].FastestLap.lap
                            : null}
                        </span>
                      ) : null}
                    </td>
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

export default WinRacesInaSeason;
