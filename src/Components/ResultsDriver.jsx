import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "./Loading";
import DriverDB from "./DriverDB";

import { DrvInfo } from "./DriverInfo";
import { useNavigate } from "react-router-dom";

const ResultsDriver = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sdata, setData] = useState([]);
  //const { season2 = "2023" } = useParams();

  const todate = (d) =>
    new Date(d).toLocaleString("en-EN", { dateStyle: "long" });
  const { driver = "alonso" } = useParams();
  let drvgivenName = "";
  let drvfamilyName = "";

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
        <Link to="/" className="btn btn-danger text-black container-fluid mb-1">
          <h1><b>F1 Race Results</b></h1>
        </Link>
        <div className="container-fluid text-center text-light">
          <h2>
            {drvgivenName} {drvfamilyName}
          </h2>
          {<DriverDB drv={drvgivenName + " " + drvfamilyName} />}
        </div>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th className="bg-danger text-center">Season</th>
                <th className="bg-danger">Race Name</th>
                <th className="text-center bg-danger">Pos</th>
                <th className="text-center bg-danger">Grid</th>
                <th className="text-center bg-danger">Constructor</th>
                <th className="text-center bg-danger">Laps</th>
                <th className="text-center bg-danger">Time</th>
                <th className="text-center bg-danger">Pts</th>
                <th className="text-center bg-danger">Fastest Lap</th>
              </tr>
            </thead>
            <tbody>
              {sdata
                ?.sort((a, b) => (a["date"] < b["date"] ? 1 : -1))
                .map((item, index) => {
                  return (
                    <tr key={index} className="text-danger">
                      <td className="col text-center">{item.season}</td>
                      <td
                        className={
                          "col cp op " + (!item.Results ? "text-info" : "")
                        }
                        onClick={() =>
                          item.Results
                            ? navigate(
                                "/F1Race/" + item.season + "/" + item.round
                              )
                            : navigate(
                                "/Sprint/" + item.season + "/" + item.round
                              )
                        }
                      >
                        Round#{item.round}{" "}
                        <b>
                          {item.Results
                            ? item.raceName
                            : item.raceName + " Sprint"}
                        </b>{" "}
                        ({todate(item.date)})
                      </td>

                      <td className={"col text-center "}>
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
                      <td className="col text-center op">
                        {item.Results
                          ? item?.Results[0]?.grid
                          : item?.SprintResults[0]?.grid}
                      </td>
                      <td className="col text-center">
                        {item?.Results
                          ? item?.Results[0]?.Constructor?.name
                          : item?.SprintResults[0]?.Constructor?.name}
                      </td>
                      <td className="col text-center op">
                        {item?.Results
                          ? item?.Results[0]?.laps
                          : item?.SprintResults[0]?.laps}
                      </td>
                      <td className="text-center col">
                        {item?.Results
                          ? item?.Results[0]?.Time?.time
                            ? item?.Results[0]?.Time?.time
                            : item?.Results[0]?.status
                          : item?.SprintResults[0]?.Time?.time
                          ? item?.SprintResults[0]?.Time?.time
                          : item?.SprintResults[0]?.status}
                      </td>
                      <td className=" text-center col op">
                        {item?.Results
                          ? item?.Results[0]?.points
                          : item?.SprintResults[0]?.points}
                      </td>

                      <td
                        className={
                          "text-center col " +
                          (item?.Results
                            ? item?.Results[0]?.FastestLap?.rank
                            : item?.SprintResults[0]?.FastestLap?.rank in
                              ["1", "2", "3", "4"]
                            ? "text-danger"
                            : "")
                        }
                      >
                        {item?.Results
                          ? item?.Results[0]?.FastestLap
                            ? "#" +
                              item?.Results[0]?.FastestLap?.rank +
                              "# " +
                              item?.Results[0]?.FastestLap?.Time.time +
                              "-" +
                              item?.Results[0]?.FastestLap?.AverageSpeed
                                ?.speed +
                              item?.Results[0]?.FastestLap?.AverageSpeed
                                ?.units +
                              "-" +
                              item?.Results[0]?.FastestLap?.lap
                            : ""
                          : item?.SprintResults[0]?.FastestLap
                          ? item?.SprintResults[0]?.FastestLap?.Time.time +
                            "-" +
                            item?.SprintResults[0]?.FastestLap?.lap
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
  }
};

export default ResultsDriver;
