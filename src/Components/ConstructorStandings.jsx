import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

const ConstructorStandings = (props) => {
  const [constructorStandings, setConstructorStandings] = useState();
  let navigate = useNavigate();

  let url;
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/constructorStandings.json`;
  } else {
    url = `https://ergast.com/api/f1/2024/constructorStandings.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setConstructorStandings(
          data["MRData"].StandingsTable.StandingsLists[0].ConstructorStandings
        );
        // console.log(data["MRData"].StandingsTable.season);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  return (
    <div className="container-fluid p-0">
      <div className="table-responsive">
        {props.season ? (
          ""
        ) : (
          <>
            <Nav />
            <h4 className="text-center py-1 fw-bold m-0">
              <span className="text-dark bg-warning px-2 rounded bg-opacity-75">
                Constructor Standings
              </span>
            </h4>
          </>
        )}
        <table className="table table-dark table-striped table-bordered">
          <thead className="text-white border-dark">
            <tr className="text-black">
              <th scope="" className="bg-danger text-center py-0">
                POS
              </th>
              <th scope="" className="bg-danger op py-0">
                CONSTRUCTOR
              </th>
              <th scope="" className="bg-danger py-0 text-center">
                WIKIPEDIA
              </th>
              <th scope="" className="bg-danger py-0 text-center">
                NATIONALITY
              </th>
              <th scope="" className="bg-danger text-center op py-0">
                POINTS
              </th>
              <th scope="" className="bg-danger text-center py-0">
                WINS
              </th>
            </tr>
          </thead>
          <tbody>
            {constructorStandings?.map((ConstructorStandings, index) => {
              return (
                <tr
                  key={ConstructorStandings.Constructor.constructorId}
                  className="align-middle"
                >
                  <td className="col-1 text-center fw-bold py-0">
                    {ConstructorStandings.position < 4 ? (
                      <i
                        className={
                          "fs-5 bi bi-" +
                          ConstructorStandings.position +
                          "-square-fill"
                        }
                      ></i>
                    ) : (
                      ConstructorStandings.position
                    )}
                  </td>
                  <td className="col op fw-bold text-warning py-0">
                    <span
                      className="bg-black p-0 px-1 cp"
                      style={{ fontFamily: "" }}
                      onClick={() => {
                        navigate(
                          "/ConstructorsResult/" +
                            ConstructorStandings?.Constructor?.constructorId +
                            "/" +
                            (props.season ? props.season : "2024")
                        );
                      }}
                    >
                      {ConstructorStandings.Constructor.name.toUpperCase()}
                    </span>

                    {/* {(ConstructorStandings.position in ["1", "2", "3", "4"]) &
                    props.season ? (
                      <Team teamName={ConstructorStandings.Constructor.name} />
                    ) : (
                      null
                    )} */}
                  </td>
                  <td className="fw-normal text-success p-0 ps-1">
                    {ConstructorStandings.Constructor.url}
                  </td>
                  <td className="col-2 text-center fst-italic py-0">
                    {ConstructorStandings.Constructor.nationality}
                  </td>
                  <td className="col-1 text-center op text-info py-0">
                    <span
                      className={
                        "fw-bold py-0 " +
                        (ConstructorStandings.points === "0"
                          ? "text-secondary"
                          : null)
                      }
                    >
                      {ConstructorStandings.points}
                    </span>
                  </td>
                  <td className="col-1 text-center text-success fw-bold py-0">
                    <span
                      className={
                        "" +
                        (ConstructorStandings.wins === "0"
                          ? "text-secondary"
                          : null)
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
