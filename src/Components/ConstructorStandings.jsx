import React from "react";
import { useEffect, useState } from "react";
import Team from "./Team";

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
        //console.log(data["MRData"]);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid p-0">
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead className="text-white border-dark">
            <tr className="text-black">
              <th scope="col" className="bg-danger text-center">
                PST
              </th>
              <th scope="col" className="bg-danger op">
                CONSTRUCTOR
              </th>
              <th scope="col" className="bg-danger">
                NATIONALITY
              </th>
              <th scope="col" className="bg-danger text-center op">
                POINTS
              </th>
              <th scope="col" className="bg-danger text-center">
                WINS
              </th>
            </tr>
          </thead>
          <tbody key={indexedDB}>
            {sdata?.map((ConstructorStandings, indexedDB) => {
              return (
                <tr key={indexedDB} className="align-middle">
                  <td className="col text-center fw-bold fs-5">
                    {ConstructorStandings.position < 4 ? (
                      <i
                        className={
                          "text-info bi bi-" + ConstructorStandings.position + "-square"
                        }
                      ></i>
                    ) : (
                      ConstructorStandings.position
                    )}
                  </td>
                  <td className="col op fw-bold fs-5 text-warning">
                    {ConstructorStandings.Constructor.name}
                    {/* {(ConstructorStandings.position in ["1", "2", "3", "4"]) &
                    props.season ? (
                      <Team teamName={ConstructorStandings.Constructor.name} />
                    ) : (
                      ""
                    )} */}
                  </td>
                  <td className="col fst-italic fs-5">
                    {ConstructorStandings.Constructor.nationality}
                  </td>
                  <td className="col text-center op text-info">
                    <b>{ConstructorStandings.points}</b>
                  </td>
                  <td className="col text-center fw-bold">
                    {ConstructorStandings.wins}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConstructorStandings;
