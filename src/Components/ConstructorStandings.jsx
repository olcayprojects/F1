import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Loading from "./Loading";
import Team from "./Team";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ConstructorStandings = (props) => {
  const [constructorStandings, setConstructorStandings] = useState();
  const [isLoaded, setIsLoaded] = useState(true);
  const [year, setYear] = useState("2025");

  let navigate = useNavigate();

  let url;
  if (props.season) {
    url = `${BASE_URL}/${props.season}/constructorStandings.json`;
  } else {
    url = `${BASE_URL}/${year}/constructorStandings.json`;
  }

  useEffect(() => {
    setIsLoaded(false);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setConstructorStandings(
          data["MRData"].StandingsTable.StandingsLists[0].ConstructorStandings
        );
        setIsLoaded(true);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
          setIsLoaded(true);
        }
      });
  }, [url, year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  if (!isLoaded) return <Loading />;

  return (
    <div className="p-0">
      {props.tab !== 1 && <Nav />}

      <div className="container-fluid">
        {props.season ? (
          ""
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-center">
              <select
                className="px-4 w-auto bg-black text-danger border-danger fw-bold fs-4 me-1 px-2 p-0"
                value={year}
                onChange={handleYearChange}
              >
                {Array.from(
                  { length: 2025 - 1950 + 1 },
                  (_, index) => 2025 - index
                ).map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
              <h2 className="text-center  fw-bold m-0 text-danger">
                CONSTRUCTOR STANDINGS
              </h2>
            </div>
          </>
        )}
        <div className="justify-content-center">
          <table className="table table-dark table-striped table-bordered">
            <thead className="border-5 fs-5 bg-danger">
              <tr className="">
                <th scope="" className="text-center py-0">
                  POS
                </th>
                <th scope="" className="op py-0">
                  CONSTRUCTOR
                </th>
                <th scope="" className="text-center op py-0">
                  POINTS
                </th>
                <th scope="" className=" text-center py-0">
                  WINS
                </th>
              </tr>
            </thead>
            <tbody>
              {constructorStandings?.map((ConstructorStandings, index) => {
                return (
                  <tr
                    key={ConstructorStandings.Constructor.constructorId}
                    className={
                      "align-middle " +
                      (ConstructorStandings.position === "1"
                        ? "fs-3"
                        : ConstructorStandings.position === "2"
                        ? "fs-4"
                        : ConstructorStandings.position === "3"
                        ? "fs-5"
                        : null)
                    }
                  >
                    <td className="text-center fw-bold py-0">
                      {ConstructorStandings.position < 2 ? (
                        <i
                          className={
                            "fs-3 bi bi-" +
                            ConstructorStandings.position +
                            "-square-fill text-info"
                          }
                        ></i>
                      ) : (
                        ConstructorStandings.position
                      )}
                    </td>
                    <td className="op fw-bold text-warning py-0">
                      <span
                        className="p-0 px-1 cp"
                        style={{ fontFamily: "" }}
                        onClick={() => {
                          navigate(
                            "/ConstructorsResult/" +
                              ConstructorStandings?.Constructor?.constructorId +
                              "/" +
                              (props.season ? props.season : "2025")
                          );
                        }}
                      >
                        {ConstructorStandings.position < 2 && (
                          <Team
                            teamName={ConstructorStandings.Constructor.name}
                            ls={2}
                          />
                        )}
                        {ConstructorStandings.Constructor.name.toUpperCase()}
                      </span>
                      <span className="ps-2 text-center text-secondary fw-light fst-italic py-0">
                        {ConstructorStandings.Constructor.nationality}
                      </span>
                    </td>
                    <td className="text-center op text-info py-0">
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
                    <td className="text-center text-success fw-bold py-0">
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
    </div>
  );
};

export default ConstructorStandings;
