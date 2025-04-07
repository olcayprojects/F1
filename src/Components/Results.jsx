import { useState, useEffect, useCallback } from "react";
import Loading from "./Loading";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const dateTime = (d, t) =>
  new Date(d + " " + t).toLocaleString("en-EN", {
    dateStyle: "short",
    timeStyle: "short",
  });

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
            const fastestLapRank1 = roundData?.Results?.find(
              (result) => result.FastestLap?.rank === "1"
            );

            return (
              <div className="col-md-auto mb-3 p-1" key={roundIndex}>
                <div className="table-responsive">
                  <table className="table table-dark table-striped table-bordered m-0 mb-1">
                    <caption className="mx-4 p-0 text-center bg-dark border-start border-end border-top border-danger border-5 text-danger caption-top">
                      <span className="text-info fs-5 fw-bold">
                        <span className="text-light pe-1">
                          #{roundData?.round}
                        </span>
                        {roundData?.raceName || "Race " + roundData?.round}
                        <br />
                        <h6 className="m-0">
                          {roundData?.Circuit.circuitName}
                        </h6>
                        <h6 className="m-0">
                          {dateTime(roundData.date, roundData.time)}
                        </h6>
                      </span>
                      {roundData?.Results?.length > 0 && fastestLapRank1 && (
                        <div className="fastest-lap border border-warning mx-1">
                          <h6 className="text-center text-warning m-0">
                            Fastest Lap: {fastestLapRank1?.FastestLap?.lap}{" "}
                            Time: {fastestLapRank1?.FastestLap?.Time?.time}{" "}
                            <br />
                            {fastestLapRank1?.FastestLap?.AverageSpeed
                              ? `Avg. Speed: ${fastestLapRank1?.FastestLap?.AverageSpeed?.speed} kph`
                              : ""}
                            <p className="text-warning ps-1 m-0">
                              {fastestLapRank1?.Driver?.givenName}{" "}
                              {fastestLapRank1?.Driver?.familyName}(
                              {fastestLapRank1?.Constructor?.name})
                            </p>
                          </h6>
                        </div>
                      )}
                    </caption>
                    <thead className="text-white border-dark">
                      <tr className="text-black">
                        <th className="bg-danger text-black py-0 text-center">P</th>
                        <th className="op bg-danger text-black text-start py-0">DRV</th>
                        <th className="bg-danger text-black text-start py-0">CAR</th>
                        <th className="op bg-danger text-black text-center py-0">L</th>
                        <th className="bg-danger text-black text-center py-0">TIME</th>
                        <th className="op bg-danger text-black text-center py-0">PT</th>
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
