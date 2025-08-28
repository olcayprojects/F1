import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const WinRacesInaSeason = (props) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [seasonResults, setSeasonResults] = useState([]);
  const dateTime = (d, t) => new Date(d + " " + t).toLocaleString();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  let navigate = useNavigate();

  const { season2 = "2024" } = useParams();
  let url = "";
  if (props.season) {
    url = `${BASE_URL}/${props.season}/results/1.json`;
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
        // console.log(err);
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
          <table className="myTable table table-dark table-striped table-bordered text-nowrap">
            <thead className="">
              <tr className="">
                <th className="text-black bg-light op p-0 text-center">R</th>
                <th className="text-warning bg-black py-0">Race Name</th>
                <th className="text-black bg-warning py-0 text-center">
                  Race Date
                </th>
                <th className="text-black bg-info op py-0 text-center">
                  Driver Info
                </th>
                <th className="text-black bg-light text-center py-0">G</th>
                <th className="text-black bg-danger text-center py-0">P</th>
                <th className="text-black bg-secondary op text-center py-0">
                  L
                </th>
                <th className="text-black bg-success text-center op py-0">
                  Time
                </th>
                <th className="text-black bg-primary text-center py-0">
                  Fastest Lap
                </th>
              </tr>
            </thead>
            <tbody>
              {seasonResults?.map((item, index) => {
                return (
                  <tr className="align-middle" key={index}>
                    <td className="op fw-bold p-0 text-center">{item.round}</td>
                    <td
                      className="col cp p-0 bg-gradient bg-black"
                      onClick={() =>
                        navigate("/F1Race/" + props.season + "/" + item.round)
                      }
                    >
                      <span className="text-warning px-2 fw-bold">
                        {item.raceName}
                      </span>
                    </td>
                    <td className="p-0 text-center">
                      <span className="bg-warning fw-bold text-black px-2">
                        {item.time ? dateTime(item.date, item.time) : item.date}
                      </span>
                    </td>
                    <td className="col op p-0">
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
                      <span className="text-secondary">
                        {`${formatDate(item.Results[0].Driver.dateOfBirth)} (${
                          item.Results[0].Driver.nationality
                        })`}
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
                    <td className="col text-center text-light op fw-bold py-0 p-0">
                      <span className="bg-black px-2">
                        {item.Results[0].grid}
                      </span>
                    </td>
                    <td className="col text-center text-danger fw-bold p-0">
                      <span className="bg-black px-2">
                        {item.Results[0].points}
                      </span>
                    </td>

                    <td className="col text-center text-secondary op fw-bold py-0 p-0">
                      <span className="bg-black px-2">
                        {item.Results[0].laps}
                      </span>
                    </td>
                    <td className="col text-center text-success fw-bold py-0 p-0">
                      <span className="bg-black px-1">
                        {item.Results[0].Time.time}
                      </span>
                    </td>

                    <td className={"text-center fw-bold p-0 "}>
                      {item.Results[0].FastestLap ? (
                        <span
                          className={
                            "px-1 m-0 bg-black " +
                            ([1, 2, 3].includes(
                              item.Results[0].FastestLap?.rank
                            )
                              ? "text-success"
                              : "text-primary")
                          }
                        >
                          <>
                            {item.Results[0].FastestLap.rank}
                            {" - "}
                            {item.Results[0].FastestLap.Time?.time}{" "}
                            {item.Results[0].FastestLap.AverageSpeed ? (
                              <>
                                {" "}
                                | AvgSpd:{" "}
                                {
                                  item.Results[0].FastestLap.AverageSpeed?.speed
                                }{" "}
                                kph |
                              </>
                            ) : (
                              ""
                            )}
                            {" (Lap "}
                            {item.Results[0].FastestLap.lap < 10
                              ? `0${item.Results[0].FastestLap.lap}`
                              : item.Results[0].FastestLap.lap}
                            )
                          </>
                        </span>
                      ) : (
                        "Fastest Lap Data Not Found!"
                      )}
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
