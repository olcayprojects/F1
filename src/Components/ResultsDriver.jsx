import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "./Loading";

const ResultsDriver = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [sdata, setData] = useState([]);
  const { season2 = "2023" } = useParams();
  const { driver = "alonso" } = useParams();
  let drvgivenName = "";
  let drvfamilyName = "";
  let drvcode = "";
  let drvdateOfBirth = "";
  let drvnationality = "";
  let drvpermanentNumber = "";
  let i,
    j = "";

  // let url = `https://ergast.com/api/f1/${season2}/drivers/${driver}/results.json`;
  let url = `https://ergast.com/api/f1/drivers/${driver}/results.json?limit=400`;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setIsLoaded(true);
        setData(data["MRData"].RaceTable.Races);
      })
      .catch((err) => {
        setIsLoaded(true);
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  if (sdata[0]?.Results) {
    drvgivenName = sdata[0].Results[0].Driver.givenName;
    drvfamilyName = sdata[0].Results[0].Driver.familyName;
    drvcode = sdata[0].Results[0].Driver.code;
    drvdateOfBirth = new Date(sdata[0].Results[0].Driver.dateOfBirth).toDateString();
    drvnationality = sdata[0].Results[0].Driver.nationality;
    drvpermanentNumber = sdata[0].Results[0].Driver.permanentNumber
      ? sdata[0].Results[0].Driver.permanentNumber
      : "";
  }

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="bg-black container-fluid">
        <Link to="/" className="btn btn-danger container-fluid">
          <img
            src={require("../images/race-car.png")}
            className="img p-0 mx-0"
            style={{ maxWidth: "10%" }}
            alt=""
          />
        </Link>

        <div className="table-responsive">
          <h1 className="text-center bg-black text-light border border-danger border-5">
            Driver Results
          </h1>

          <table className="table table-dark bg-dark table-bordered table-hover text-danger border border-danger border-5 caption-top">
            <caption className="text-danger text-center">
              <h3 className="bg-danger text-black">
                {drvgivenName + " " + drvfamilyName}
              </h3>
              <h4>
                {"(" +
                  drvcode +"#"+
                  drvpermanentNumber +
                  ") " +
                  drvdateOfBirth +
                  " " +
                  drvnationality}
              </h4>
            </caption>
            <thead className="border-dark">
              <tr className="text-black">
                <th className="bg-danger">Season</th>
                <th className="bg-danger">Race Name</th>
                <th className="bg-danger">Pos</th>
                <th className="text-center bg-danger">Grid</th>
                <th className="text-center bg-danger">Constructor</th>
                <th className="text-center bg-danger">Laps</th>
                <th className="text-center bg-danger">Time</th>
                <th className="text-center bg-danger">Pts</th>
                <th className="text-center bg-danger">Fastest Lap</th>
              </tr>
            </thead>
            {sdata?.map((item, index) => {
              i = item.season;

              return (
                <tbody key={index}>
                  {item?.Results?.map((results, indexQ) => {

                    return (
                      <tr key={indexQ}>
                        <td>{item.season}</td>
                        <td className="col">
                          Round#{item.round} <b> {item.raceName}</b> (
                          {item.date})
                        </td>

                        <td
                          className={
                            "col text-center " +
                            (results.positionText in ["1","2","3","4"] 
                              ? "bg-black text-danger"
                              : "")
                          }
                        >
                          {results.positionText}
                        </td>
                        <td className="col text-center">{results.grid}</td>
                        <td className="col">{results.Constructor.name}</td>
                        <td className="col">{results.laps}</td>
                        <td className=" text-center col">
                          {results.Time?.time
                            ? results.Time.time
                            : results.status}
                        </td>
                        <td className=" text-center col">{results.points}</td>

                        <td
                          className={
                            "text-center col " +
                            (results.FastestLap?.rank in ["1","2","3","4"]  ? "bg-black" : "")
                          }
                        >
                          #<b>{results.FastestLap?.rank}</b># <b>{results.FastestLap?.Time.time}</b>-
                           {results.FastestLap?.AverageSpeed.speed}
                          {results.FastestLap?.AverageSpeed.units}-
                          {results.FastestLap?.lap}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              );
            })}
          </table>
        </div>
        <hr />
      </div>
    );
  }
};

export default ResultsDriver;
