import React from "react";
import { useEffect, useState } from "react";

const ConstructorStandings = (props) => {
  const [sdata, setData] = useState([]);

  let url = "";
  if (props.season) {

    url = `https://ergast.com/api/f1/${props.season}/${props.round}/constructorStandings.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(
          data["MRData"].StandingsTable.StandingsLists[0].ConstructorStandings);
         //console.log(data["MRData"].StandingsTable[0].ConstructorStandings);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid">

      <hr />
      <h1 className="text-center bg-black text-danger border border-danger border-5">
      Constructor Standings
      </h1>

      <table className="table table-dark table-bordered table-hover text-danger border border-danger border-5 ">
      <thead className="text-white">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Constructor</th>
            <th scope="col">Nationality</th>
            <th scope="col">Points</th>
            <th scope="col">Wins</th>
            <th scope="col">Information-Constructor wikipedia</th>
          </tr>
        </thead>
        {sdata?.map((ConstructorStandings, indexedDB) => {
          return (
            <tbody key={indexedDB}>
              <tr key={indexedDB}>
                <td className="col">{ConstructorStandings.position}</td>
                <td className="col-2">{ConstructorStandings.Constructor.name}</td>
                <td className="col-2">{ConstructorStandings.Constructor.nationality}</td>
                <td className="col">{ConstructorStandings.points}</td>
                <td className="col">{ConstructorStandings.wins}</td>
                <td className="col">
                  <a href={ConstructorStandings.Constructor.url} className="link-danger">
                    {ConstructorStandings.Constructor.url}
                  </a>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};


export default ConstructorStandings;
