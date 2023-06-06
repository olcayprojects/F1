import React, { useEffect, useState } from "react";
import QualifyingResults from "./QualifyingResults";
import WinRacesInaSeason from "./WinRacesInaSeason";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import Pitstops from "./Pitstops";
import Next from "./Next";
import Laptimes from "./Laptimes";
import Images from "./Images";

const F1 = () => {
  const [sdata, setData] = useState([]);
  let season = "";
  let round = "";
  let laps = "";

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
        <Next />
        {sdata?.map((item, index) => {
          season = item.season;
          round = item.round;
          laps = item.Results[0].laps;

          return (
            <div key={index} className="bg-black pt-2">
              {/* {console.log(item)} */}
              <div className="table-responsive px-2">
                <h1 className="text-center text-light bg-black border border-danger border-5">
                  {" "}
                  {item.date} {item.raceName} #{item.round}
                  <Images name={item.raceName.split(" ")[0]} />
                </h1>
                <table className="table table-dark table-striped border-5 ">
                  <thead className="text">
                    <tr className="text">
                      <th>POS</th>
                      <th>GRID</th>
                      <th>DRIVER</th>
                      <th>CONSTRUCTOR</th>
                      <th>TIME</th>
                      <th>LAPS</th>
                      <th>FASTEST LAP</th>
                    </tr>
                  </thead>
                  <tbody className="text-danger">
                    {item.Results.map((result, index) => {
                      return (
                        <tr key={index} className="text-danger">
                          <td className="col">{result.positionText}</td>
                          <td className="col">{result.grid}</td>
                          <td className="col-4">
                            {result.Driver.code}({result.number}){" "}
                            {result.Driver.givenName} {result.Driver.familyName}{" "}
                            ({result.Driver.nationality})
                            {result.Driver.dateOfBirth})
                          </td>
                          <td className="col-1">{result.Constructor.name}</td>
                          <td className="col-1">
                            {result.Time?.time
                              ? result.Time.time
                              : result.status}
                          </td>
                          <td className="col">{result.laps}</td>
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
        <WinRacesInaSeason season={season} />;
        <h1 className="text-center bg-black text-danger border border-danger border-5">
          Lap Times
        </h1>
        <div className="row row-cols-1 row-cols-md-6 g-2 justify-content-md-center bg-dark">
          {(() => {
            const arr = [];
            for (let i = laps-6; i <= laps; i++) {
              arr.push(
                <div key={i} className="col mb-1">
                  <Laptimes season={season} round={round} lapsx={i} />
                </div>
              );
            }
            return arr;
          })()}
        </div>
      </div>
    </>
  );
};

export default F1;
