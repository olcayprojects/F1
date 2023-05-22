import react, { useEffect, useState } from "react";
import QualifyingResults from "./QualifyingResults";
import WinRacesInaSeason from "./WinRacesInaSeason";


const F1 = () => {
  const [sdata, setData] = useState([]);
  let  season="";
  let  round="";
 
  
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
      <div className="container-fluid bg-black text-light">
        {sdata?.map((item, index) => {
          season=(item.season);
          round=(item.round);
          
          return (
            <div key={index}>
              {/* {console.log(item)} */}
              <h1 className="text-center">
                {" "}
                {item.season} {item.raceName} #{item.round}
              </h1>
              <div className="table-responsive">
                <table className="table table-striped table-dark table-bordered  table-hover ">
                  <thead></thead>
                  <tbody>
                    {item.Results.map((result, index) => {
                      // console.log(result);

                      return (
                        <tr key={index} className="tableRow">
                          <td>{result.position}</td>
                          <td>{result.Driver.code}</td>
                          <td>
                            {result.Driver.givenName} {result.Driver.familyName}
                          </td>
                          <td>
                            {result.Time?.time ? result.Time.time : "00.00"}
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
        {console.log(season)}
        {console.log(round)}
        <QualifyingResults season={season} round={round}/>
        <WinRacesInaSeason/>

        
      </div>
    </>
  );
};

export default F1;
