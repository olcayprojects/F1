import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QualifyingResults from "./QualifyingResults";
import Pitstops from "./Pitstops";
import Next from "./Next";
import Laptimes from "./Laptimes";
import Images from "./Images";

const F1Race = () => {
  const [sdata, setData] = useState([]);
  let season = "";
  let round = "";
  let laps = "";
  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const { rounds = "1" } = useParams();

  useEffect(() => {
    fetch(`https://ergast.com/api/f1/${season2}/${rounds}/results.json`)
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
          const dateTime = (d, t) => new Date(d + " " + t).toLocaleString();

          return (
            <div key={index} className="bg-black pt-2 container-fluid">
              {/* {console.log(item)} */}

              <h1 className="text-center text-light bg-black border border-danger border-5">
                {item.raceName} #{item.round} ({dateTime(item.date, item.time)})
              </h1>
              <div className="table-responsive-sm">
                <table className="table table-dark table-striped border-5 ">
                  <thead className="text">
                    <tr className="text">
                      <th>P</th>
                      <th>G</th>
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
                          <td className="col-4 ">
                            {result.Driver.code}({result.number}){" "}
                            <b>
                              <u>
                                {result.Driver.givenName}{" "}
                                {result.Driver.familyName}
                              </u>
                            </b>
                            ({result.Driver.nationality}){" "}
                            {result.Driver.dateOfBirth}
                          </td>
                          <td className="col-1">{result.Constructor.name}</td>
                          <td className="col-1">
                            {result.Time?.time
                              ? result.Time.time
                              : result.status}
                          </td>
                          <td className="col">{result.laps}</td>
                          <td className="col-5">
                            Average({result.FastestLap?.AverageSpeed?.speed}
                            kph)Speed | Time({result.FastestLap?.Time.time}) |
                            Lap({result.FastestLap?.lap})
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <hr />
            </div>
          );
        })}
        <QualifyingResults season={season} round={round} />
        <Pitstops season={season} round={round} />
        <div className="bg-black container-fluid">
          <hr />

          <h1 className="text-center bg-black text-danger border border-danger border-5">
            Lap Times
          </h1>
          <div className="row row-cols-1 row-cols-md-6 g-1 justify-content-md-center bg-black">
            {(() => {
              const arr = [];
              for (let i = laps - 12; i <= laps; i++) {
                arr.push(
                  <div key={i} className="col mb-0">
                    <Laptimes season={season} round={round} lapsx={i} />
                  </div>
                );
              }
              return arr;
            })()}
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

export default F1Race;
