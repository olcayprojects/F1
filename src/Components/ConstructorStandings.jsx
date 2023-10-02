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
    <div className="container p-0">
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead className="text-white border-dark fs-5">
            <tr className="text-black">
              <th scope="" className="bg-danger text-center">
                POS
              </th>
              <th scope="" className="bg-danger op">
                CONSTRUCTOR
              </th>
              <th scope="" className="bg-danger">
                NATIONALITY
              </th>
              <th scope="" className="bg-danger text-center op">
                POINTS
              </th>
              <th scope="" className="bg-danger text-center">
                WINS
              </th>
            </tr>
          </thead>
          <tbody key={indexedDB}>
            {sdata?.map((ConstructorStandings, indexedDB) => {
              return (
                <tr key={indexedDB} className="align-middle">
                  <td className="col-1 text-center fw-bold fs-5">
                    {ConstructorStandings.position < 4 ? (
                      <i
                        className={
                          "text-info bi bi-" +
                          ConstructorStandings.position +
                          "-square"
                        }
                      ></i>
                    ) : (
                      ConstructorStandings.position
                    )}
                  </td>
                  <td className="col op fw-bold fs-5 text-warning ">
                    {ConstructorStandings.Constructor.name}
                    {/* {(ConstructorStandings.position in ["1", "2", "3", "4"]) &
                    props.season ? (
                      <Team teamName={ConstructorStandings.Constructor.name} />
                    ) : (
                      ""
                    )} */}
                  </td>
                  <td className="col-2 fst-italic fs-5">
                    {ConstructorStandings.Constructor.nationality}
                  </td>
                  <td className="col-1 text-center op text-info">
                    <span
                      className={
                        "fs-5 fw-bold bg-black px-2 p-2 " +
                        (ConstructorStandings.points?.length === 2
                          ? "px-3"
                          : ConstructorStandings.points?.length === 1
                          ? "px-4"
                          : "px-2")
                      }
                    >
                      {ConstructorStandings.points}
                    </span>
                  </td>
                  <td className="col-1 text-center fw-bold">
                    <span
                      className={
                        "bg-black fs-5  p-2 " +
                        (ConstructorStandings.wins?.length === 2
                          ? "px-3"
                          : ConstructorStandings.wins?.length === 1
                          ? "px-4"
                          : "px-2")
                      }
                    >
                      {ConstructorStandings.wins}
                    </span>
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
