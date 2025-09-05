import React, { useEffect, useState } from "react";
import Loading from "./Loading";

const Results = ({ season }) => {
  const [races, setRaces] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const dateTime = (d, t) =>
    t
      ? new Date(d + " " + t).toLocaleString("en-EN", {
          dateStyle: "long",
          timeStyle: "short",
        })
      : d;

  useEffect(() => {
    const fetchAllData = async () => {
      let allRaces = [];
      const limit = 100;

      const initialRes = await fetch(
        `https://api.jolpi.ca/ergast/f1/${season}/results.json?limit=${limit}&offset=0`
      );
      const initialData = await initialRes.json();
      const totalCount = parseInt(initialData.MRData.total, 10);

      for (let offset = 0; offset < totalCount; offset += limit) {
        const res = await fetch(
          `https://api.jolpi.ca/ergast/f1/${season}/results.json?limit=${limit}&offset=${offset}`
        );
        const data = await res.json();
        allRaces = [...allRaces, ...data.MRData.RaceTable.Races];
      }

      const groupedByRound = {};
      allRaces.forEach((race) => {
        const round = race.round;
        if (!groupedByRound[round]) {
          groupedByRound[round] = { ...race };
        } else {
          groupedByRound[round].Results = [
            ...(groupedByRound[round].Results || []),
            ...(race.Results || []),
          ];
        }
      });

      setIsLoaded(true);
      setRaces(groupedByRound);
    };

    fetchAllData();
  }, [season]);

  const renderTable = (race) => {
    const fastest = race.Results.find(
      (result) => result.FastestLap && result.FastestLap.rank === "1"
    );

    const fastestLapInfo = fastest
      ? `Fastest: ${fastest.Driver.code} - ${
          fastest.FastestLap.Time.time
        } (Lap ${fastest.FastestLap.lap}${
          fastest.FastestLap.AverageSpeed?.speed
            ? `, ${fastest.FastestLap.AverageSpeed.speed} ${fastest.FastestLap.AverageSpeed.units}`
            : ""
        })`
      : null;

    return (
      <div className="table-responsive">
        <table
          className="table table-dark table-striped table-bordered  animate__fadeInDown animate__animated animate__fast"
          key={race.round}
          style={{}}
        >
          <caption className="mx-4 p-0 text-center bg-dark border-start border-end border-top border-danger border-5 text-danger caption-top">
            <span className="text-info fs-6 fw-bold">
              <span className="text-light pe-1">#{race?.round}</span>
              {race?.raceName || "Race " + race?.round}
              <pre className="m-0">{race?.Circuit.circuitName}</pre>
              <pre className="m-0">{dateTime(race.date, race.time)}</pre>
            </span>
            {fastestLapInfo && (
              <pre className="text-warning m-0">{fastestLapInfo}</pre>
            )}
          </caption>
          <thead className="">
            <tr>
              <th className="bg-danger text-black p-0 text-center">P</th>
              <th className="bg-danger text-black p-0 text-center">G</th>
              <th className="op bg-danger text-black text-start p-0 text-nowrap">
                DRV
              </th>
              <th className="bg-danger text-black text-start py-0 text-nowrap">
                TEAM
              </th>
              <th className="op bg-danger text-black text-center py-0">L</th>
              <th className="bg-danger text-black text-center py-0 text-nowrap">
                TIME
              </th>
              <th className="op bg-danger text-black text-center py-0">PT</th>
            </tr>
          </thead>
          <tbody className="animate__fadeInDown animate__animated animate__slower">
            {race.Results.map((result, i) => (
              <tr key={i}>
                <td className="text-center p-0">{result.position}</td>
                <td className="text-center text-secondary p-0">
                  {result.grid}
                </td>
                <td className="text-nowrap">{`${result.Driver.familyName}`}</td>
                <td className="text-nowrap p-0">{result.Constructor.name}</td>
                <td className="text-center p-0">{result.laps}</td>
                <td className="text-center text-nowrap p-0">
                  {result.Time?.time || result.status}
                </td>
                <td className="text-center">{result.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center g-1 m-0">
        {Object.keys(races)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((round) => (
            <div className="col-auto me-1" key={round}>
              {renderTable(races[round])}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Results;
