import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Sprint = () => {
  const { season2 = "2023" } = useParams();
  const { rounds = "1" } = useParams();
  const [data, setData] = useState();

  let url = `https://ergast.com/api/f1/${season2}/${rounds}/sprint.json`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setData(items["MRData"].RaceTable.Races[0]);
          console.log(items["MRData"].RaceTable.Races[0]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return (
    <div className="table-responsive-md">
      <h1 className="text-danger text-center">
        {data?.raceName} Sprint Qualifying Results - {data?.season}/
        {data?.round} - {data?.date}/{data?.time}
      </h1>
      <table className="table table-dark table-striped">
        <thead className="text">
          <tr className="">
            <th className="">P</th>
            <th className="bg-danger">G</th>
            <th className="">DRIVER</th>
            <th className="bg-danger">CONSTRUCTOR</th>
            <th className="">LAPS</th>
            <th className="bg-danger">TIME</th>
            <th className="">PTS</th>
            <th className="bg-danger">FASTEST LAP</th>
            <th className="bg-danger">CIRCUIT NAME</th>
          </tr>
        </thead>
        <tbody>
          {data?.SprintResults.map((item, index) => {
            return (
              <tr key={index}>
                <td className="col">{item.position}</td>
                <td className="col">{item.grid}</td>
                <td className="col">
                  {item.Driver.givenName} {item.Driver.familyName}
                </td>
                <td className="col">{item.Constructor.name}</td>
                <td className="col">{item.laps}</td>
                <td className="col">{
                item.Time?.time ? item.Time?.time :item.status
                }</td>
                <td className="col">{item.points}</td>
                <td className="col">
                 {item.FastestLap?.Time.time}({item.FastestLap?.lap}) 
                </td>
                <td className="col">{data?.Circuit?.circuitName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Sprint;
