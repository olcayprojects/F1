import React, { useEffect, useState } from "react";
import QualifyingResults from "./QualifyingResults";
import WinRacesInaSeason from "./WinRacesInaSeason";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import Pitstops from "./Pitstops";
import Next from "./Next";

const F1 = () => {
  const [sdata, setData] = useState([]);
  let season = "";
  let round = "";

  useEffect(() => {
    fetch("https://ergast.com/api/f1/current/last/results.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
        <div className="container.fluid bg-dark p-3">
    <Next/>
        {sdata?.map((item, index) => {
          season = item.season;
          round = item.round;

          return (
            <div key={index} className="bg-black pt-2">
              {/* {console.log(item)} */}
              <div className="table-responsive px-2">
                <h1 className="text-center text-light bg-black border border-danger border-5">
                  {" "}
                  {item.season} {item.raceName} #{item.round}
                </h1>
                <table className="table table-dark table-striped border-5 ">
                     <thead className="text">
                    <tr className="text">
                      <th>POS</th>
                      <th>No</th>
                      <th>DRIVER</th>
                      <th>CONSTRUCTOR</th>
                      <th>TIME</th>
                      <th>FASTEST LAP</th>
                    </tr>
                  </thead>
                  <tbody className="text-danger">
                    {item.Results.map((result, index) => {
                      return (
                        <tr key={index} className="text-danger">
                          <td className="col">{result.position}</td>
                          <td className="col">{result.number}</td>
                          <td className="col-3">
                            {result.Driver.givenName} {result.Driver.familyName}
                            ({result.Driver.code})
                          </td>
                          <td className="col-2">{result.Constructor.name}</td>
                          <td className="col-1">
                            {result.Time?.time ? result.Time.time : "00.00"}
                          </td>
                          <td className="col-5">
                            Average( {result.FastestLap.AverageSpeed.speed} kph
                            )Speed | Time({result.FastestLap.Time.time}) | Lap(
                            {result.FastestLap.lap})
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
     
            </div>
          );
        })}

        <QualifyingResults season={season} round={round} />
        <Pitstops season={season} round={round} />
        <DriverStandings season={season} round={round} />
        <ConstructorStandings season={season} round={round} />
        <WinRacesInaSeason season={season} />
      </div>
    </>
  );
};

export default F1;
