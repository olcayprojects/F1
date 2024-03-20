import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import DriverDB from "./DriverDB";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

const ResultsDriver = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sdata, setData] = useState([]);
  //const { season2 = "2023" } = useParams();

  const { driver = "alonso" } = useParams();
  let drvgivenName = "";
  let drvfamilyName = "";
  const dateTime = (d, t) => new Date(d + " " + t);

  // let url = `https://ergast.com/api/f1/${season2}/drivers/${driver}/results.json`;
  let url = `https://ergast.com/api/f1/drivers/${driver}/results.json?limit=400`;
  let urlSprint = `https://ergast.com/api/f1/drivers/${driver}/sprint.json`;

  useEffect(() => {
    Promise.all([fetch(url), fetch(urlSprint)])
      .then(([resRace, resSprint]) =>
        Promise.all([resRace.json(), resSprint.json()])
      )
      .then(([dataRace, dataSprint]) => {
        setIsLoaded(true);

        setData(
          dataRace["MRData"].RaceTable.Races.concat(
            dataSprint["MRData"].RaceTable.Races
          )
        );
        //setData(dataSprint["MRData"].RaceTable.Races);
        // setSprintData(dataSprint["MRData"]);
      })
      .catch((err) => {
        setIsLoaded(true);
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url, urlSprint]);

  if (sdata[0]?.Results) {
    drvgivenName = sdata[0]?.Results[0]?.Driver.givenName;
    drvfamilyName = sdata[0]?.Results[0]?.Driver.familyName;
  } else {
    drvgivenName = sdata[0]?.SprintResults[0]?.Driver.givenName;
    drvfamilyName = sdata[0]?.SprintResults[0]?.Driver.familyName;
  }

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="bg-black container-fluid p-0">
        <Nav />

        <div className="container-fluid text-center text-light">
          <h4 className="">
            <span className="text-black bg-info px-2  fw-bold">
              {drvgivenName}
            </span>
            <span className="text-black bg-danger px-2  fw-bold">
              {drvfamilyName}
            </span>
          </h4>
          {<DriverDB drv={drvgivenName + " " + drvfamilyName} />}
        </div>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr className="">
                <th className="bg-danger text-center">S</th>
                <th className="text-center">R</th>
                <th className="bg-danger">Race Name</th>
                <th className="text-center">Pos</th>
                <th className="text-center bg-danger">Grid</th>
                <th className="text-center">Constructor</th>
                <th className="text-center bg-danger">Laps</th>
                <th className="text-center">Time</th>
                <th className="text-center bg-danger">Pts</th>
                <th className="text-center">Fastest Lap</th>
              </tr>
            </thead>
            <tbody>
              {sdata
                ?.sort((a, b) => (a["date"] < b["date"] ? 1 : -1))
                .map((item, index) => {
                  return (
                    <tr key={index} className="text-danger align-middle">
                      <td className="text-center p-0 op">{item.season}</td>
                      <td className="text-center p-0">{item.round}</td>
                      <td
                        className={
                          "py-0 cp op " + (!item.Results ? "text-info" : null)
                        }
                        onClick={() =>
                          item.Results
                            ? navigate(
                                "/F1Race/" + item.season + "/" + item.round
                              )
                            : navigate(
                                "/Sprint/" +
                                  item.season +
                                  "/" +
                                  item.round +
                                  "/" +
                                  dateTime(
                                    item?.date,
                                    item?.time
                                  ).toLocaleString("tr-TR", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })
                              )
                        }
                      >
                        <span className="px-1 d-inline-block w-100">
                          <span className="fw-bold text-decoration-underline">
                            {item.Results
                              ? item.raceName
                              : item.raceName + " Sprint"}
                          </span>{" "}
                          <span className="fst-italic">
                            ({new Date(item.date).toDateString()})
                          </span>
                        </span>
                      </td>
                      <td className={"py-0  text-center "}>
                        {item.Results ? (
                          item?.Results[0]?.positionText < 4 ? (
                            <i
                              className={
                                "bi bi-" +
                                item?.Results[0]?.positionText +
                                "-square fs-5"
                              }
                            ></i>
                          ) : (
                            item?.Results[0]?.positionText
                          )
                        ) : item?.SprintResults[0]?.positionText < 4 ? (
                          <i
                            className={
                              "text-info bi bi-" +
                              item?.SprintResults[0]?.positionText +
                              "-square fs-5"
                            }
                          ></i>
                        ) : (
                          item?.SprintResults[0]?.positionText
                        )}
                      </td>
                      <td className="text-center op py-0">
                        {item.Results
                          ? item?.Results[0]?.grid
                          : item?.SprintResults[0]?.grid}
                      </td>
                      <td className="py-0 text-center">
                        <span className="p-0 d-inline-block fw-bold w-100 text-center text-success">
                          {item?.Results
                            ? item?.Results[0]?.Constructor?.name
                            : item?.SprintResults[0]?.Constructor?.name}
                        </span>
                      </td>
                      <td className="py-0 text-center op">
                        {item?.Results
                          ? item?.Results[0]?.laps
                          : item?.SprintResults[0]?.laps}
                      </td>
                      <td className="py-0 text-center text-warning">
                        {item?.Results ? (
                          item?.Results[0]?.Time?.time ? (
                            item?.Results[0]?.Time?.time
                          ) : (
                            <span className="text-danger">
                              {item?.Results[0]?.status}
                            </span>
                          )
                        ) : item?.SprintResults[0]?.Time?.time ? (
                          item?.SprintResults[0]?.Time?.time
                        ) : (
                          <span className="text-danger">
                            {item?.SprintResults[0]?.status}
                          </span>
                        )}
                      </td>
                      <td className="py-0 text-center op">
                        {item?.Results
                          ? item?.Results[0]?.points
                          : item?.SprintResults[0]?.points}
                      </td>

                      <td className="py-0">
                        <span className="px-1 fw-bold text-secondary d-block w-100">
                          {item?.Results
                            ? item?.Results[0]?.FastestLap
                              ? item?.Results[0]?.FastestLap?.rank +
                                ". | Time: " +
                                item?.Results[0]?.FastestLap?.Time.time +
                                " | AvgSpd: " +
                                item?.Results[0]?.FastestLap?.AverageSpeed
                                  ?.speed +
                                item?.Results[0]?.FastestLap?.AverageSpeed
                                  ?.units +
                                " | Lap: " +
                                item?.Results[0]?.FastestLap?.lap
                              : ""
                            : item?.SprintResults[0]?.FastestLap
                            ? "Time: " +
                              item?.SprintResults[0]?.FastestLap?.Time.time +
                              " | Lap: " +
                              item?.SprintResults[0]?.FastestLap?.lap
                            : null}
                        </span>
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

export default ResultsDriver;
