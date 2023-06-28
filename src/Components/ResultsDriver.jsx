import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "./Loading";
import F1Race from "./F1Race";
import DriverDB from "./DriverDB";

import { DrvInfo } from "./DriverInfo";
import { useNavigate } from "react-router-dom";

const ResultsDriver = () => {
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);

  const [sdata, setData] = useState([]);
  //const { season2 = "2023" } = useParams();
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
    drvgivenName = sdata[0]?.Results[0].Driver.givenName;
    drvfamilyName = sdata[0]?.Results[0].Driver.familyName;
    drvcode = sdata[0]?.Results[0]?.Driver.code;
    drvdateOfBirth = new Date(
      sdata[0]?.Results[0]?.Driver.dateOfBirth
    ).toDateString();
    drvnationality = sdata[0]?.Results[0].Driver.nationality;
    drvpermanentNumber = sdata[0]?.Results[0].Driver.permanentNumber
      ? sdata[0]?.Results[0]?.Driver.permanentNumber
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
            className="img-fluid p-0 mx-0"
            style={{ maxWidth: "10%" }}
            alt=""
          />
        </Link>
        <div className="container-fluid text-center text-light">
        <h1>{drvgivenName} {drvfamilyName}</h1>
          {<DrvInfo drv={drvgivenName + " " + drvfamilyName} />}
          {<DriverDB drv={drvgivenName + " " + drvfamilyName} />}
        </div>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th className="bg-danger text-center">Season</th>
                <th className="bg-danger">Race Name</th>
                <th className="text-center bg-danger">Pos</th>
                <th className="text-center bg-danger">Grid</th>
                <th className="text-center bg-danger">Constructor</th>
                <th className="text-center bg-danger">Laps</th>
                <th className="text-center bg-danger">Time</th>
                <th className="text-center bg-danger">Pts</th>
                <th className="text-center bg-danger">Fastest Lap</th>
              </tr>
            </thead>
            <tbody>
              {sdata?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="col text-center">{item.season}</td>
                    <td
                      className="col cp"
                      onClick={() =>
                        navigate("/F1Race/" + item.season + "/" + item.round)
                      }
                    >
                      Round#{item.round} <b> {item.raceName}</b> ({item.date})
                    </td>

                    <td
                      className={
                        "col text-center " +
                        (item.Results[0]?.positionText in ["1", "2", "3", "4"]
                          ? "text-danger"
                          : "")
                      }
                    >
                      {item.Results[0]?.positionText}
                    </td>
                    <td className="col text-center">{item.Results[0]?.grid}</td>
                    <td className="col text-center">
                      {item.Results[0]?.Constructor.name}
                    </td>
                    <td className="col text-center">{item.Results[0]?.laps}</td>
                    <td className="text-center col">
                      {item.Results[0]?.Time?.time
                        ? item.Results[0]?.Time.time
                        : item.Results[0]?.status}
                    </td>
                    <td className=" text-center col">
                      {item.Results[0]?.points}
                    </td>

                    <td
                      className={
                        "text-center col " +
                        (item.Results[0]?.FastestLap?.rank in
                        ["1", "2", "3", "4"]
                          ? "text-danger"
                          : "")
                      }
                    >
                      #<b>{item.Results[0]?.FastestLap?.rank}</b>#{" "}
                      <b>{item.Results[0]?.FastestLap?.Time.time}</b>-
                      {item.Results[0]?.FastestLap?.AverageSpeed.speed}
                      {item.Results[0]?.FastestLap?.AverageSpeed.units}-
                      {item.Results[0]?.FastestLap?.lap}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default ResultsDriver;
