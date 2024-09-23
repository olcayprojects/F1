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
  const { driver = "alonso" } = useParams();
  let drvgivenName = "";
  let drvfamilyName = "";

  const fetchAllData = async () => {
    const limit = 100;
    let offset = 0;
    let allData = [];
    let hasMoreData = true;

    while (hasMoreData) {
      const url = `https://ergast.com/api/f1/drivers/${driver}/results.json?limit=${limit}&offset=${offset}`;
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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const raceData = await fetchAllData();
        const sprintResponse = await fetch(
          `https://ergast.com/api/f1/drivers/${driver}/sprint.json`
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
  }, [driver]);

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

        <div className="container-fluid text-center text-light mt-1">
          <h4>
            <span className="text-black bg-info px-2 fw-bold">
              {drvgivenName}
            </span>
            <span className="text-black bg-warning px-2 fw-bold text-uppercase">
              {drvfamilyName}
            </span>
          </h4>
          <DriverDB drv={`${drvgivenName} ${drvfamilyName}`} />
        </div>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr>
                <th className="bg-danger text-center">S</th>
                <th className="text-center">R</th>
                <th className="bg-danger">Race Name</th>
                <th className="text-center">P</th>
                <th className="text-center bg-danger">G</th>
                <th className="text-center">Constructor</th>
                <th className="text-center bg-danger">Laps</th>
                <th className="text-center">Time / Status</th>
                <th className="text-center bg-danger">Pts</th>
                <th className="text-center">Fastest Lap</th>
              </tr>
            </thead>
            <tbody>
              {sdata
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .map((item, index) => {
                  const results = item.Results || item.SprintResults || [];
                  return (
                    <tr key={index} className="text-danger align-middle">
                      <td className="text-center p-0 op">{item.season}</td>
                      <td className="text-center p-0">{item.round}</td>
                      <td
                        className={`py-0 cp op ${
                          !item.Results ? "text-info" : ""
                        }`}
                        onClick={() =>
                          item.Results
                            ? navigate(`/F1Race/${item.season}/${item.round}`)
                            : navigate(
                                `/Sprint/${item.season}/${
                                  item.round
                                }/${new Date(
                                  item.date + " " + item.time
                                ).toLocaleString("tr-TR", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}`
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

                      <td
                        className={
                          "py-0 text-center fw-bold " +
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
                      <td className="text-center op py-0">
                        {results.length > 0 ? results[0].grid : "-"}
                      </td>
                      <td className="py-0 text-center text-uppercase">
                        <span className="p-0 d-inline-block fw-bold w-100 text-center text-success">
                          {results.length > 0
                            ? results[0]?.Constructor?.name
                            : "-"}
                        </span>
                      </td>
                      <td className="py-0 text-center op">
                        {results.length > 0 ? results[0].laps : "-"}
                      </td>
                      <td className="py-0 text-center text-warning">
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
                      <td className="py-0">
                        <span className="px-1 fw-bold text-secondary text-center">
                          {results.length > 0 && results[0]?.FastestLap ? (
                            <>
                              {results[0].FastestLap.rank}. Time:{" "}
                              {results[0].FastestLap.Time?.time || "-"} |
                              AvgSpd:{" "}
                              {results[0].FastestLap.AverageSpeed?.speed || "-"}{" "}
                              {results[0].FastestLap.AverageSpeed?.units || ""}|
                              Lap: {results[0].FastestLap.lap || "-"}
                            </>
                          ) : (
                            <span className="text-danger">-</span>
                          )}
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
