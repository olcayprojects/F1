import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Classifications = ({ season }) => {
  const [raceResults, setRaceResults] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const limit = 100;

  const getShortRaceName = (raceName) => {
    return raceName.slice(0, 3).toUpperCase();
  };

  useEffect(() => {
    const fetchAllResults = async () => {
      let offset = 0;
      let allRaces = [];
      let total = 0;

      try {
        do {
          const res = await fetch(
            `${BASE_URL}/${season}/results.json?limit=${limit}&offset=${offset}`
          );
          const data = await res.json();
          const races = data.MRData.RaceTable.Races;
          total = parseInt(data.MRData.total);
          allRaces = [...allRaces, ...races];
          offset += limit;
        } while (offset < total);

        const uniqueRoundsMap = {};
        allRaces.forEach((race) => {
          const round = race.round;
          if (!uniqueRoundsMap[round]) {
            uniqueRoundsMap[round] = race;
          } else {
            uniqueRoundsMap[round].Results = [
              ...uniqueRoundsMap[round].Results,
              ...race.Results,
            ];
          }
        });

        const uniqueRaces = Object.values(uniqueRoundsMap).sort(
          (a, b) => parseInt(a.round) - parseInt(b.round)
        );

        setRaceResults(uniqueRaces);
      } catch (error) {}
    };

    fetchAllResults();
  }, [season]);

  useEffect(() => {
    if (raceResults.length > 0) {
      const fetchDriverStandings = async () => {
        try {
          const res = await fetch(`${BASE_URL}/${season}/driverstandings.json`);
          const data = await res.json();

          const standings =
            data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

          const updatedDriversData = standings.map((stand) => ({
            pos: stand.positionText,
            driverId: stand.Driver.driverId,
            code: stand.Driver.code,
            name: `${stand.Driver.givenName} ${stand.Driver.familyName}`,
            driverNationality: stand.Driver.nationality,
            constructors: stand.Constructors[0].name,
            constructorsNationality: stand.Constructors[0].nationality,
            points: parseInt(stand.points),
            wins: parseInt(stand.wins),
            raceResults: Array(raceResults.length).fill(null),
          }));

          setDriversData(updatedDriversData);
        } catch (error) {}
      };

      fetchDriverStandings();
    }
  }, [season, raceResults]);

  useEffect(() => {
    if (raceResults.length > 0 && driversData.length > 0) {
      const updatedDriversData = [...driversData];

      raceResults.forEach((race, raceIndex) => {
        race.Results.forEach((result) => {
          const driverId = result.Driver.driverId;
          const driver = updatedDriversData.find(
            (driver) => driver.driverId === driverId
          );

          if (driver) {
            driver.raceResults[raceIndex] = {
              position: result.positionText,
              points: result.points,
            };
          }
        });
      });

      setDriversData(updatedDriversData);
      setLoading(false);
    }
  }, [raceResults, driversData.length]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-fluid p-0">
      <div className="table-responsive">
        <table className="myTable table table-dark table-striped table-bordered border-dark text-center">
          <thead>
            <tr className="">
              <th className="text-primary-emphasis bg-primary p-0">P</th>
              <th className="text-warning-emphasis bg-warning text-start">
                Driver / Constructor
              </th>
              {raceResults.map((race, idx) => (
                <th
                  title={race.raceName}
                  className="text-danger-emphasis bg-danger p-0"
                  key={idx}
                >
                  {getShortRaceName(race.raceName)}
                </th>
              ))}
              <th className="p-0"></th>
              <th className="text-success-emphasis bg-success p-0">W</th>
              <th className="text-info-emphasis bg-info p-0">PTS</th>
            </tr>
          </thead>
          <tbody>
            {driversData.map((driver, idx) => (
              <tr className="align-all-middle" key={idx}>
                <td className="text-primary p-0">{driver.pos}</td>
                <td
                  className="text-warning cp text-start"
                  title={driver.name}
                  onClick={() => {
                    navigate("/ResultsDriver/" + driver.driverId);
                  }}
                >
                  {driver.pos !== "0" ? (
                    <>
                      {driver.name} / {driver.constructors}
                      <hr className="m-0 border-3" />
                      <span className="text-warning-emphasis">
                        {driver.driverNationality} /{" "}
                        {driver.constructorsNationality}
                        {/* <DrvInfo drv={driver.name} s="1" /> */}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="pe-1">{driver.name}</span>
                      <span className="text-warning-emphasis">
                        {driver.constructors}
                      </span>
                    </>
                  )}
                </td>
                {driver.raceResults.map((res, i) => {
                  return (
                    <td
                      className={
                        "p-0 " + !isNaN(res?.position)
                          ? "text-danger"
                          : "text-light"
                      }
                      key={i}
                    >
                      {res?.position || "-"}
                    </td>
                  );
                })}
                <td className="p-0"></td>
                <td className="text-success fw-bold p-0">{driver.wins}</td>
                <td className="text-info fw-bolder p-0">{driver.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classifications;
