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

        <div className="container-fluid text-center p-0 text-light mt-1">
          <h4 className="">
            <span className="text-info-emphasis px-1 bg-info fw-bold">
              {drvgivenName}
            </span>
            <span className="text-warning-emphasis px-1 bg-warning fw-bold text-uppercase">
              {drvfamilyName}
            </span>
          </h4>
          <DriverDB drv={`${drvgivenName} ${drvfamilyName}`} />
        </div>

        {sortedSeasons.map((season) => (
          <div className="pt-1">
            <h3 className="text-center text-primary m-0">
              <span className="bg-dark px-2">Season {season}</span>
            </h3>
            <div className="table-responsive-sm">
              <div key={season}>
                <table className="myTable mb-1 table table-dark table-striped table-bordered border-dark">
                  <thead>
                    <tr className="">
                      <th className="text-center">S</th>
                      <th className="text-center">R</th>
                      <th className="">Race Name</th>
                      <th className="text-center text-info bg-info-subtle">
                        P
                      </th>
                      <th className="text-center bg-secondary text-secondary-emphasis">
                        G
                      </th>
                      <th className="text-center bg-success text-success-emphasis">
                        Constructor
                      </th>
                      <th className="text-center bg-primary text-primary-emphasis">
                        LAPS
                      </th>
                      <th className="text-center bg-warning text-warning-emphasis">
                        Time / Status
                      </th>
                      <th className="text-center bg-light text-light-emphasis">
                        PTS
                      </th>
                      <th className="bg-danger text-danger-emphasis">
                        <span className="">Fastest Lap</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData[season]
                      .sort((a, b) => (a.date < b.date ? 1 : -1))
                      .map((item, index) => {
                        const results =
                          item.Results || item.SprintResults || [];
                        return (
                          <tr key={index} className="text-danger align-middle">
                            <td className="text-center op">{item.season}</td>
                            <td className="text-center">{item.round}</td>
                            <td
                              className={`p op ${
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
                              <span className="d-inline-block w-100">
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
                                "text-center text-info fw-bold " +
                                (results[0]
                                  ? isNaN(results[0]?.positionText)
                                    ? " text-danger"
                                    : null
                                  : null)
                              }
                            >
                              {/* {(() => {
                                const position = results[0]?.positionText; 
                                const positionDigits = position
                                  ? position.split("")
                                  : []; 

                                const isNumber = (value) => !isNaN(value);

                                return (
                                  <>
                                    {positionDigits.map((item, index) => {
                                      if (isNumber(item)) {
                                        return (
                                          <i
                                            key={index}
                                            className={`bi bi-${item}-square-fill fs-5`}
                                          />
                                        );
                                      }
                                      return results[0]?.positionText;
                                    })}
                                  </>
                                );
                              })()} */}
                              {isNaN(parseInt(results[0]?.positionText))
                                ? `${results[0]?.position} ${results[0]?.positionText}`
                                : results[0]?.positionText}
                            </td>

                            <td className="text-center text-secondary fw-bold op">
                              {results.length > 0 ? results[0].grid : "-"}
                            </td>
                            <td
                              className="text-center text-uppercase cp"
                              onClick={() => {
                                navigate(
                                  "/ConstructorsResult/" +
                                    results[0]?.Constructor?.constructorId +
                                    "/" +
                                    item.season
                                );
                              }}
                            >
                              <span className="fw-bold  text-center text-success">
                                {results.length > 0
                                  ? results[0]?.Constructor?.name
                                  : "-"}
                              </span>
                            </td>
                            <td className="text-center text-primary fw-bold op">
                              {results.length > 0 ? results[0].laps : "-"}
                            </td>
                            <td className="text-center text-warning">
                              {results.length > 0 ? (
                                <>
                                  <span>{results[0]?.Time?.time}</span>
                                  <span className="text-danger">
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
                            <td className="">
                              <span className="text-danger fw-bold text-secondary text-center">
                                {results.length > 0 &&
                                results[0]?.FastestLap ? (
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
                      <td
                        colSpan={10}
                        className="text-center text-light fw-bold"
                      >
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
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default ResultsDriver;
