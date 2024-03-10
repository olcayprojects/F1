import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

const ConstructorStandings = (props) => {
  const [sdata, setData] = useState();
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
        setData(
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
    <div className="container p-0">
      <div className="table-responsive">
        {props.season ? (
          ""
        ) : (
          <>
            <Nav />
            <h1 className="text-warning text-center">Constructor Standings</h1>
          </>
        )}
        <table className="table table-dark table-striped table-bordered">
          <thead className="text-white border-dark">
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
          <tbody>
            {sdata?.map((ConstructorStandings, index) => {
              return (
                <tr
                  key={ConstructorStandings.Constructor.constructorId}
                  className="align-middle"
                >
                  <td className="col-1 text-center fw-bold">
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
                  <td className="col op fw-bold text-warning cp">
                    <span
                      className="bg-black p-1"
                      style={{ fontFamily: "Lucida Console" }}
                      onClick={() => {
                        navigate(
                          "/ConstructorsResult/" +
                            ConstructorStandings?.Constructor?.constructorId +
                            "/" +
                            (props.season ? props.season : "2024")
                        );
                      }}
                    >
                      {ConstructorStandings.Constructor.name}
                    </span>

                    {/* {(ConstructorStandings.position in ["1", "2", "3", "4"]) &
                    props.season ? (
                      <Team teamName={ConstructorStandings.Constructor.name} />
                    ) : (
                      null
                    )} */}
                  </td>
                  <td className="col-2 fst-italic">
                    {ConstructorStandings.Constructor.nationality}
                  </td>
                  <td className="col-1 text-center op text-info">
                    <span className={"fw-bold bg-black d-block p-1"}>
                      {ConstructorStandings.points}
                    </span>
                  </td>
                  <td className="col-1 text-center fw-bold">
                    <span className={"bg-black d-block p-1"}>
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
