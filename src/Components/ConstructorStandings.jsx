import React from "react";
import { useEffect, useState } from "react";

const ConstructorStandings = (props) => {
  const [sdata, setData] = useState([]);

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/constructorStandings.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(
          data["MRData"].StandingsTable.StandingsLists[0].ConstructorStandings
        );
        //console.log(data["MRData"].StandingsTable[0].ConstructorStandings);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid">
      <hr />
      <h1 className="text-center bg-black text-danger border border-danger border-5">
        Constructor Standings {props.season}
      </h1>
      <div className="table-responsive">

      <table className="table table-dark table-bordered table-hover text-danger border border-danger border-5 ">
        <thead className="text-white border-dark">
          <tr className="text-black">
            <th scope="col" className="bg-danger">
              P
            </th>
            <th scope="col" className="bg-danger">
              CONSTRUCTOR
            </th>
            <th scope="col" className="bg-danger">
              NATIONALITY
            </th>
            <th scope="col" className="bg-danger">
              POINTS
            </th>
            <th scope="col" className="bg-danger text-center">
              WINS
            </th>
            <th scope="col" className="bg-danger">
              INFORMATION-CONSTRUCTOR WIKIPEDIA
            </th>
          </tr>
        </thead>
        {sdata?.map((ConstructorStandings, indexedDB) => {
          return (
            <tbody key={indexedDB}>
              <tr key={indexedDB} className="">
                <td className="col">{ConstructorStandings.position}</td>
                <td className="col-2">
                  {ConstructorStandings.Constructor.name}
                </td>
                <td className="col-2">
                  {ConstructorStandings.Constructor.nationality}
                </td>
                <td className="col">{ConstructorStandings.points}</td>
                <td className="col text-center">{ConstructorStandings.wins}</td>
                <td className="col">
                  <a
                    href={ConstructorStandings.Constructor.url}
                    className="link-danger"
                  >
                    {ConstructorStandings.Constructor.url}
                  </a>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
      </div>
    </div>
  );
};

export default ConstructorStandings;
