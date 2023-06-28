import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Circuit = (props) => {
  const navigate = useNavigate();

  const { cname = "Austrian Grand Prix" } = useParams();
  const [data, setData] = useState();

  const winsCount = {};

  let url = `https://ergast.com/api/f1/circuits/${cname}/results/1.json?limit=100`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setData(items["MRData"].RaceTable.Races);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return (
    <div className="container-fluid">
      <h1 className="bg-danger text-black text-center">
        {data
          ? data[0]?.Circuit.circuitName +
            " |" +
            data[0]?.Circuit.Location.locality +
            "/" +
            data[0]?.Circuit.Location.country +
            "|"
          : ""}
      </h1>

      <div className="row">
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped">
            <thead className="text">
              <tr>
                <th>#</th>
                <th>SEASON</th>
                <th>DATE</th>
                <th>RND</th>
                <th>WINNER</th>
                <th>GRID</th>
                <th>LAPS</th>
                <th>TIME</th>
                <th>CONSTRUCTOR</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => {
                if (item.Results[0]?.Driver.driverId in winsCount) {
                  winsCount[item.Results[0]?.Driver.driverId] += 1;
                } else {
                  winsCount[item.Results[0]?.Driver.driverId] = 1;
                }
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td
                    className="cp"
                     onClick={() => {
                      navigate(
                        "/F1/" + item.season
                      );
                    }}
                    >
                      {item.season}</td>
                    <td>{item.date}</td>
                    <td>{item.round}</td>
                    <td className="cp"
                     onClick={() => {
                      navigate(
                        "/ResultsDriver/" + item.Results[0]?.Driver.driverId
                      );
                    }}

                    >
                      {item.Results[0]?.Driver.givenName}{" "}
                      {item.Results[0]?.Driver.familyName}{" "}
                    </td>
                    <td>{item.Results[0]?.grid}</td>
                    <td>{item.Results[0]?.laps}</td>
                    <td>{item.Results[0]?.Time.time}</td>
                    <td>{item.Results[0]?.Constructor.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Circuit;
