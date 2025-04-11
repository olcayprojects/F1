import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import DriverDB from "./DriverDB";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ResultsDriver = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sdata, setData] = useState([]);
  const { driver = "alonso" } = useParams();
  let drvgivenName = "";
  let drvfamilyName = "";

  const fetchAllData = useCallback(async () => {
    const limit = 100;
    let offset = 0;
    let allData = [];
    let hasMoreData = true;

    while (hasMoreData) {
      const url = `${BASE_URL}/drivers/${driver}/results.json?limit=${limit}&offset=${offset}`;
      const response = await fetch(url);
      const data = await response.json();
      const races = data["MRData"].RaceTable.Races;

      if (races.length > 0) {
        allData = allData.concat(races);
        offset += limit;
      } else {
        hasMoreData = false;
      }
    }

    return allData;
  }, [driver]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const raceData = await fetchAllData();
        const sprintResponse = await fetch(
          `${BASE_URL}/drivers/${driver}/sprint.json`
        );
        const sprintData = await sprintResponse.json();

        setIsLoaded(true);
        setData(raceData.concat(sprintData["MRData"].RaceTable.Races));
      } catch (error) {
        setIsLoaded(true);
        console.error(error);
      }
    };

    fetchData();
  }, [driver, fetchAllData]);

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
    const groupedData = sdata.reduce((acc, item) => {
      const season = item.season;
      if (!acc[season]) {
        acc[season] = [];
      }
      acc[season].push(item);
      return acc;
    }, {});

    const sortedSeasons = Object.keys(groupedData).sort((a, b) => b - a);

    return (
      <div className="bg-black container-fluid p-0">
        <Nav />

        <div className="container-fluid text-center text-light mt-1">
          <h4 className="m-0">
            <span className="text-black bg-info px-2 fw-bold">
              {drvgivenName}
            </span>
            <span className="text-black bg-warning px-2 fw-bold text-uppercase">
              {drvfamilyName}
            </span>
          </h4>
          <DriverDB drv={`${drvgivenName} ${drvfamilyName}`} />
        </div>
        <div className="table-responsive-sm pt-2">
          {sortedSeasons.map((season) => (
            <div key={season}>
              <h3 className="text-center m-0 text-primary">
                <span className="bg-dark px-2">Season {season}</span>
              </h3>
              <table className="myTable mb-1 table table-dark table-striped table-bordered border-dark">
                <thead>
                  <tr className="table-active">
                    <th className="text-center">S</th>
                    <th className="text-center">R</th>
                    <th className="">Race Name</th>
                    <th className="text-center">P</th>
                    <th className="text-center">G</th>
                    <th className="text-center text-success">Constructor</th>
                    <th className="text-center">LAPS</th>
                    <th className="text-center text-warning">Time / Status</th>
                    <th className="text-center">PTS</th>
                    <th className="text-center text-danger">
                      <span className="">Fastest Lap</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData[season]
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .map((item, index) => {
                      const results = item.Results || item.SprintResults || [];
                      return (
                        <tr key={index} className="text-danger align-middle">
                          <td className="text-center p-0 op">{item.season}</td>
                          <td className="text-center p-0">{item.round}</td>
                          <td
                            className={`p-0 px-1 cp op ${
                              !item.Results ? "text-info" : ""
                            }`}
                            onClick={() =>
                              item.Results
                                ? navigate(
                                    `/F1Race/${item.season}/${item.round}`
                                  )
                                : navigate(
                                    `/Sprint/${item.season}/${
                                      item.round
                                    }/${new Date(item.date + " " + item.time)
                                      .toLocaleString("tr-TR", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                      })
                                      .replace(/,/g, "")}`
                                  )
                            }
                          >
                            <span className="bg-black px-2 d-inline-block w-100">
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
                          <td
                            className={
                              "p-0 text-center fw-bold " +
                              (results[0]
                                ? isNaN(parseInt(results[0]?.positionText))
                                  ? " text-danger"
                                  : null
                                : null)
                            }
                          >
                            {results[0] ? (
                              results[0]?.positionText < 4 ? (
                                <i
                                  className={
                                    "bi bi-" +
                                    results[0]?.positionText +
                                    "-square fs-5"
                                  }
                                ></i>
                              ) : (
                                results[0]?.positionText
                              )
                            ) : null}
                          </td>
                          <td className="text-center op p-0">
                            {results.length > 0 ? results[0].grid : "-"}
                          </td>
                          <td
                            className="p-0 text-center text-uppercase cp"
                            onClick={() => {
                              navigate(
                                "/ConstructorsResult/" +
                                  results[0]?.Constructor?.constructorId +
                                  "/" +
                                  item.season
                              );
                            }}
                          >
                            <span className="p-0 d-inline-block fw-bold w-100 text-center text-success">
                              {results.length > 0
                                ? results[0]?.Constructor?.name
                                : "-"}
                            </span>
                          </td>
                          <td className="p-0 text-center op">
                            {results.length > 0 ? results[0].laps : "-"}
                          </td>
                          <td className="p-0 text-center text-warning">
                            {results.length > 0 ? (
                              <>
                                <span>{results[0]?.Time?.time}</span>
                                <span className="text-danger ps-1">
                                  {results[0]?.status !== "Finished"
                                    ? results[0]?.status
                                    : null}
                                </span>
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-center op">
                            {results.length > 0 ? results[0].points : "-"}
                          </td>
                          <td className="p-0">
                            <span className="bg-black text-danger p-1 px-2 fw-bold text-secondary text-center">
                              {results.length > 0 && results[0]?.FastestLap ? (
                                <>
                                  <span className="">
                                    {results[0].FastestLap.rank
                                      ? "#" +
                                        results[0].FastestLap.rank +
                                        " || "
                                      : null}
                                  </span>
                                  Time:{" "}
                                  {results[0].FastestLap.Time?.time + " || "}
                                  {results[0].FastestLap.AverageSpeed
                                    ? "AvgSpd: " +
                                      results[0].FastestLap.AverageSpeed
                                        ?.speed +
                                      " " +
                                      results[0].FastestLap.AverageSpeed
                                        ?.units +
                                      " || "
                                    : null}
                                  Lap: {results[0].FastestLap.lap}
                                </>
                              ) : (
                                <span className="text-danger">-</span>
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td colSpan={10} className="text-center text-light fw-bold">
                      Total Points:{" "}
                      {groupedData[season]
                        .reduce((totalPoints, item) => {
                          const results =
                            item.Results || item.SprintResults || [];
                          const points = results[0]?.points;

                          if (points !== undefined && points !== null) {
                            return totalPoints + parseFloat(points);
                          }
                          return totalPoints;
                        }, 0)
                        .toFixed(0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ResultsDriver;
