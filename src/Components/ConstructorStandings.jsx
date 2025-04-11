import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Loading from "./Loading";
import Team from "./Team";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ConstructorStandings = (props) => {
  const [constructorStandings, setConstructorStandings] = useState();
  const [constructor, setConstructor] = useState();
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

      <div className="container-fluid p-0">
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
        {year == new Date().getFullYear() ? (
          <div className="container-fluid d-flex flex-column justify-content-center align-items-center fw-bold">
            <img
              src={constructor?.strBadge + "/small"}
              alt=""
              title={constructor?.strDescriptionEN}
              className="img-fluid"
            />
            <h4 className="text-warning-emphasis m-0 fw-bold">
              {constructor?.strTeam}-{constructor?.intFormedYear}
            </h4>
            <h4 className="text-warning-emphasis m-0 fw-bold">
              {constructor?.strLocation}
            </h4>
          </div>
        ) : (
          ""
        )}
        <div className="justify-content-center">
        <table className="myTable table table-dark table-striped table-bordered border-dark">
        <thead className="border-5 fs-6">
              <tr className="">
                <th scope="" className="bg-light text-center py-0 text-black">
                  POS
                </th>
                <th scope="" className="bg-warning op py-0 text-black">
                  CONSTRUCTOR
                </th>
                <th scope="" className="bg-info text-end op py-0 text-black">
                  POINTS
                </th>
                <th scope="" className=" bg-primary py-0 text-black">
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
                        ? "fs-5"
                        : ConstructorStandings.position === "2"
                        ? "fs-6"
                        : null)
                    }
                  >
                    <td className="text-center fw-bold py-0">
                      {ConstructorStandings.position < 2 ? (
                        <i
                          className={
                            "fs-3 bi bi-" +
                            ConstructorStandings.position +
                            "-square-fill text-light"
                          }
                        ></i>
                      ) : (
                        ConstructorStandings.position
                      )}
                    </td>
                    <td className="op fw-bold text-warning py-0">
                      <span
                        className="p-0 px-1 cp bg-black"
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
                            constructor={setConstructor}
                            ls={2}
                          />
                        )}
                        {ConstructorStandings.Constructor.name.toUpperCase()}
                      </span>
                      <span className="px-2 text-center bg-warning-subtle text-black fw-light fst-italic py-0">
                        {ConstructorStandings.Constructor.nationality}
                      </span>
                    </td>
                    <td className="text-end op text-info py-1">
                      <span
                        className={
                          "d-block fw-bold pe-2 " +
                          (ConstructorStandings.points === "0"
                            ? "text-secondary"
                            : "bg-black")
                        }
                      >
                        {ConstructorStandings.points}
                      </span>
                    </td>
                    <td className="text-primary fw-bold p-0">
                      <span
                        className={
                          "d-block ps-2 " +
                          (ConstructorStandings.wins === "0"
                            ? "text-secondary"
                            : "bg-black")
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
