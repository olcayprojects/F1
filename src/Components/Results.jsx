import { useState, useEffect, useCallback } from "react";
import Loading from "./Loading";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Results = (props) => {
  const [sdata, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const roundsArray = [...Array(3)].map((_, index) => index + 1);

  const fetchResultStandings = useCallback(async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const raceData = data?.MRData?.RaceTable?.Races[0];
      return raceData;
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const allRoundsData = [];

      for (let round of roundsArray) {
        const url = `${BASE_URL}/${props.season}/${round}/results.json`;
        const roundData = await fetchResultStandings(url);
        if (roundData) {
          allRoundsData.push(roundData);
        }
      }

      setData(allRoundsData);
      setLoading(false);
    };

    fetchData();

    return () => {
      setLoading(false);
    };
  }, [props.season, fetchResultStandings]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        {sdata.length > 0 ? (
          sdata.map((roundData, roundIndex) => {
            if (!roundData?.Results || roundData?.Results?.length === 0) {
              return null;
            }

            return (
              <div className="col-md-auto mb-3 p-1" key={roundIndex}>
                <div className="table-responsive">
                  <table className="table table-dark table-striped table-bordered m-0 mb-1">
                    <caption className="mx-4 p-0 text-center bg-dark border-start border-end border-top border-danger border-5 text-danger caption-top">
                      <span className="text-info fs-5 fw-bold">
                        <span className="text-light pe-1">
                          #{roundIndex + 1}
                        </span>
                        {roundData?.raceName || "Race " + (roundIndex + 1)}
                      </span>
                    </caption>
                    <thead className="text-white border-dark">
                      <tr className="text-black">
                        <th className="py-0 text-center">P</th>
                        <th className="bg-danger text-start py-0">DRV</th>
                        <th className="text-start py-0">CAR</th>
                        <th className="bg-danger text-center py-0">L</th>
                        <th className="text-center py-0">TIME</th>
                        <th className="text-center bg-danger py-0">PT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roundData?.Results?.map((result, index) => (
                        <tr key={index}>
                          <td className="p-0 op text-danger text-center fw-bold">
                            {result.positionText}
                          </td>
                          <td
                            className="p-0 fw-bold text-warning text-center"
                            title={
                              result.Driver.givenName +
                              " " +
                              result.Driver.familyName.toUpperCase()
                            }
                          >
                            {result.Driver.code
                              ? result.Driver.code
                              : result.Driver.familyName
                                  .toUpperCase()
                                  .slice(0, 3)}
                          </td>
                          <td className="p-0 px-1 op">
                            {result.Constructor.name}
                          </td>
                          <td className="p-0 text-center">{result.laps}</td>
                          <td className="text-center p-0 op">
                            {result?.Time?.time ? (
                              result?.Time.time
                            ) : result?.status[0] === "+" ? (
                              <span className="text-secondary">
                                {result?.status}
                              </span>
                            ) : (
                              <span className="text-danger text-uppercase m-0">
                                {result?.status}
                              </span>
                            )}
                          </td>
                          <td className="text-center p-0">{result?.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Verisi olan her yarış için Fastest lap bilgilerini gösteriyoruz */}
                  {roundData?.Results?.length > 0 && (
                    <div className="fastest-lap">
                      <h6 className="text-center text-warning">
                        Fastest Lap: {roundData.Results[0]?.FastestLap?.lap}{" "}
                        Time: {roundData.Results[0]?.FastestLap?.Time?.time}{" "}
                        <br />
                        {roundData.Results[0]?.FastestLap?.AverageSpeed
                          ? `Avg. Speed: ${roundData.Results[0]?.FastestLap?.AverageSpeed?.speed} kph`
                          : ""}
                        <p className="text-info ps-1 fw-bold">
                          {roundData.Results[0]?.Driver.familyName}
                        </p>
                      </h6>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No results available for the selected season.</p>
        )}
      </div>
    </div>
  );
};

export default Results;
