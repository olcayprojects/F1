import react, { useEffect, useState } from "react";

const WinRacesInaSeason = (props) => {
  const [sdata, setData] = useState([]);

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/results/1.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        console.log(data["MRData"].RaceTable);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [url]);

  return (
    <>
    <hr />
    <h1 className="text-center bg-dark text-danger">Drivers and Constructors Winning Races In a Season</h1>
    
    <div className="row row-cols-1 row-cols-md-3 g-2 justify-content-md-center bg-black">
      {sdata?.map((item, index) => {
        return (
          
          <div key={index} className="col">
   
               <table className="table table-striped table-bordered table-dark bg-dark text-light  table-hover text-center h-100">
              <tbody>
                
                  <tr className="bg-primary">Round #{item.round} {item.raceName} ({item.date})</tr>
                  <tr>{" | "}{item.Results[0].Driver.code}{" | "}
                {item.Results[0].Driver.givenName}{" "}
                {item.Results[0].Driver.familyName}{" | "}
                {item.Results[0].Driver.nationality}{"("}
                {item.Results[0].Driver.dateOfBirth}{") |"}
                </tr>
                <tr>{item.Results[0].Constructor.name}</tr>
                <tr>{item.Results[0].laps}</tr>
                <tr>{item.Results[0].Time.time}</tr>
                <tr>{item.Results[0].points}</tr>
                <tr>Average Speed</tr>
                <tr>{item.Results[0].FastestLap.AverageSpeed.speed}kph</tr>
                <tr>{item.Results[0].FastestLap.Time.time}</tr>
                <tr>{item.Results[0].FastestLap.lap}</tr>
                  
                
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
            </>
  );
};

export default WinRacesInaSeason;
