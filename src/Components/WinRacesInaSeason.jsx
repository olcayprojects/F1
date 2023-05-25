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
        // console.log(data["MRData"].RaceTable);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid">
      
      <h1 className="text-center bg-black text-danger border border-danger border-5 mb-2">
        Drivers and Constructors Winning Races In a Season
      </h1>

      <div className="row row-cols-1 row-cols-md-3 g-2 justify-content-md-center bg-dark">
        {sdata?.map((item, index) => {
          return (
            <div key={index} className="col mb-1">
              <table className="table  table-bordered table-dark bg-dark table-hover text-center h-100 border border-danger border-5">
                <tbody>
                  <tr className="bg-danger text-black">
                    Round#{item.round} {item.raceName} ({item.date})
                  </tr>
                  <tr>
                    |{item.Results[0].Driver.code}|  
                    {item.Results[0].Driver.givenName}{" "}
                    {item.Results[0].Driver.familyName}|
                    {item.Results[0].Driver.nationality}|
                    {item.Results[0].Driver.dateOfBirth}|
                  </tr>
                  <tr>Constructor:{item.Results[0].Constructor.name}</tr>
                  <tr>Laps: {item.Results[0].laps}</tr>
                  <tr>Time: {item.Results[0].Time.time}</tr>
                  <tr>Points: {item.Results[0].points}</tr>
                  <tr>***************</tr>
                  <tr>Average Speed</tr>
                  <tr>
                    {item.Results[0].FastestLap.AverageSpeed.speed}kph Time:
                    {item.Results[0].FastestLap.Time.time} Lap:
                    {item.Results[0].FastestLap.lap}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default WinRacesInaSeason;
