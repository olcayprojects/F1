import react, { useEffect, useState } from "react";
import QualifyingResults from "./QualifyingResults";
import WinRacesInaSeason from "./WinRacesInaSeason";
import DriverStandings from "./DriverStandings";

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
      <div className="container-fluid bg-danger text-light">
        {sdata?.map((item, index) => {
          season = item.season;
          round = item.round;

          return (
            <div key={index}>
              {/* {console.log(item)} */}
              <h1 className="text-center bg-dark text-danger">
                {" "}
                {item.season} {item.raceName} #{item.round}
              </h1>
              <div className="table-responsive">
                <table className="table table-striped table-dark table-bordered  table-hover text-danger">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>No</th>                      
                      <th>Driver</th>
                      <th>Constructor</th>
                      <th>Time</th>
                      <th>Fastest Lap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.Results.map((result, index) => {
                    

                      return (
                        <tr key={index} className="">
                          <td className="col-1">{result.position}</td>
                          <td className="col-1">{result.number}</td>                          
                          <td className="col-2">
                          {result.Driver.givenName} {result.Driver.familyName}({result.Driver.code})
                          </td>
                          <td className="col-2">{result.Constructor.name}</td>
                          <td className="col-1">
                            {result.Time?.time ? result.Time.time : "00.00"}
                          </td>
                          <td className="col-5">
                          Average( {result.FastestLap.AverageSpeed.speed} kph )Speed | 
                          Time({result.FastestLap.Time.time}) | 
                          Lap({result.FastestLap.lap})
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
        <WinRacesInaSeason season={season} />
        <DriverStandings season={season} round={round} />
      </div>
    </>
  );
};

export default F1;
